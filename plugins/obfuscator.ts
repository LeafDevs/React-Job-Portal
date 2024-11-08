import { Plugin } from 'vite'
import * as JavaScriptObfuscator from 'javascript-obfuscator'

interface ObfuscatorOptions {
  exclude?: string[];
  options?: JavaScriptObfuscator.ObfuscatorOptions;
}

export default function viteObfuscator(config: ObfuscatorOptions = {}): Plugin {
  const defaultOptions: JavaScriptObfuscator.ObfuscatorOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    shuffleStringArray: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
  }

  return {
    name: 'vite-plugin-obfuscator',
    apply: 'build',
    enforce: 'post',
    
    async generateBundle(_, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName]
        
        // Skip if file should be excluded
        if (config.exclude?.some(pattern => fileName.includes(pattern))) {
          continue
        }

        // Only process JS files
        if (chunk.type === 'chunk' && fileName.endsWith('.js')) {
          const code = chunk.code
          
          try {
            const result = JavaScriptObfuscator.obfuscate(
              code,
              {
                ...defaultOptions,
                ...config.options
              }
            )

            chunk.code = result.getObfuscatedCode()
          } catch (error) {
            console.error(`Failed to obfuscate ${fileName}:`, error)
          }
        }
      }
    }
  }
}