import { Plugin } from 'vite'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

interface WebpConverterOptions {
  quality?: number;
  exclude?: string[];
  preserveOriginal?: boolean;
}

export default function webpConverter(options: WebpConverterOptions = { 
  quality: 80,
  exclude: [],
  preserveOriginal: true
}): Plugin {
  const cache = new Set<string>()
  let viteConfig: any
  
  return {
    name: 'webp-converter',
    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },
    async transform(code, id) {
      if (!id.match(/\.(tsx?|jsx?|vue)$/)) return

      // More comprehensive regex to match image imports and references
      const imageRegex = /(?:import\s+.*?from\s+['"]([^'"]*\.(?:png|jpg|jpeg|avif))['"])|(?:['"]([^'"]*\.(?:png|jpg|jpeg|avif))['"])|(?:src=["']([^'"]*\.(?:png|jpg|jpeg|avif))["'])/g
      let match
      let modifiedCode = code

      while ((match = imageRegex.exec(code)) !== null) {
        const imgPath = match[1] || match[2] || match[3]
        if (!imgPath || imgPath.includes('http')) continue

        // Skip excluded patterns
        if (options.exclude?.some(pattern => 
          imgPath.includes(pattern) || 
          imgPath.includes('texture') || 
          imgPath.includes('background') ||
          imgPath.includes('bg')
        )) {
          continue
        }

        try {
          let resolvedPath = imgPath
          if (imgPath.startsWith('@')) {
            resolvedPath = path.join(
              viteConfig.root, 
              'src', 
              imgPath.slice(2)
            )
          } else {
            resolvedPath = path.resolve(path.dirname(id), imgPath)
          }

          if (cache.has(resolvedPath)) continue

          // Check if file exists
          try {
            await fs.access(resolvedPath)
          } catch {
            console.warn(`Warning: Image file not found: ${resolvedPath}`)
            continue
          }

          // Skip if the file is in specific directories or has specific names
          if (resolvedPath.includes('/textures/') || 
              resolvedPath.includes('/backgrounds/') ||
              resolvedPath.includes('texture') ||
              resolvedPath.includes('background') ||
              resolvedPath.includes('bg')) {
            continue
          }

          // Create WebP version
          const webpPath = resolvedPath.replace(/\.(png|jpg|jpeg|avif)$/, '.webp')
          await sharp(resolvedPath)
            .webp({ quality: options.quality })
            .toFile(webpPath)

          if (options.preserveOriginal) {
            // Keep the original file
            await fs.copyFile(resolvedPath, resolvedPath + '.original')
          }

          // Update reference in code
          const newImgPath = imgPath.replace(/\.(png|jpg|jpeg|avif)$/, '.webp')
          const originalMatch = match[0]
          modifiedCode = modifiedCode.replace(originalMatch, originalMatch.replace(imgPath, newImgPath))
          
          cache.add(resolvedPath)
        } catch (error) {
          console.error(`Failed to convert ${imgPath} to WebP:`, error)
        }
      }

      return {
        code: modifiedCode,
        map: null
      }
    }
  }
}