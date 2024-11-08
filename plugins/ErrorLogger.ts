import type { Plugin } from 'vite';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import template from '@babel/template';

interface ErrorLoggerOptions {
  backendUrl?: string;
  exclude?: string[];
}

export default function errorLogger(options: ErrorLoggerOptions = {}): Plugin {
  const backendUrl = options.backendUrl || (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://api.lesbians.monster');

  return {
    name: 'error-logger',
    enforce: 'pre',

    transform(code: string, id: string) {
      // Skip non-React files and excluded paths
      if (!id.match(/\.(tsx?|jsx?)$/) || 
          options.exclude?.some(pattern => id.includes(pattern)) ||
          id.includes('node_modules')) {
        return;
      }

      try {
        // Parse the code into an AST
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript', 'decorators-legacy'],
        });

        // Create error boundary wrapper template
        const wrapWithErrorBoundary = template.expression(`
          <ErrorBoundary>
            COMPONENT
          </ErrorBoundary>
        `);

        // Create try-catch wrapper template
        const wrapWithTryCatch = template.statement(`
          try {
            BODY
          } catch (error) {
            if (error instanceof Error) {
              ErrorLogger.logError(error, COMPONENT_NAME);
            }
            throw error;
          }
        `);

        traverse(ast, {
          // Add ErrorLogger import if not present
          Program: {
            enter(path) {
              let hasErrorImport = false;
              path.node.body.forEach(node => {
                if (t.isImportDeclaration(node) && 
                    node.source.value.includes('ErrorBoundary')) {
                  hasErrorImport = true;
                }
              });

              if (!hasErrorImport) {
                path.node.body.unshift(
                  t.importDeclaration(
                    [t.importSpecifier(
                      t.identifier('ErrorBoundary'),
                      t.identifier('ErrorBoundary')
                    )],
                    t.stringLiteral('@/components/ErrorBoundary')
                  )
                );
              }
            }
          },

          // Wrap function components with error boundary
          JSXElement(path) {
            if (path.parent.type === 'ReturnStatement' &&
                path.findParent(p => p.isFunctionDeclaration() || p.isArrowFunctionExpression())) {
              const wrappedJSX = wrapWithErrorBoundary({
                COMPONENT: path.node
              });
              path.replaceWith(wrappedJSX);
            }
          },

          // Wrap event handlers and effects with try-catch
          Function(path) {
            if (path.node.async || 
                path.node.generator || 
                path.findParent(p => {
                  if (!p.isCallExpression()) return false;
                  const callee = p.node.callee;
                  return t.isIdentifier(callee) && 
                    ['useEffect', 'useCallback', 'useState'].includes(callee.name);
                })) {
              
              const parentFunction = path.findParent(p => 
                p.isFunctionDeclaration() || 
                p.isArrowFunctionExpression()
              );

              let componentName = 'UnnamedComponent';
              if (parentFunction?.isFunctionDeclaration() && parentFunction.node.id) {
                componentName = parentFunction.node.id.name;
              } else if (parentFunction?.isArrowFunctionExpression() && 
                        t.isVariableDeclarator(parentFunction.parent) &&
                        t.isIdentifier(parentFunction.parent.id)) {
                componentName = parentFunction.parent.id.name;
              }

              const wrappedBody = wrapWithTryCatch({
                BODY: path.node.body,
                COMPONENT_NAME: t.stringLiteral(componentName)
              });
              path.get('body').replaceWith(wrappedBody);
            }
          }
        });

        // Generate the modified code
        const output = generate(ast, {
          retainLines: true,
          compact: false,
        });

        return {
          code: output.code,
          map: output.map
        };
      } catch (error) {
        console.error('Error processing file:', id, error);
        return null;
      }
    }
  };
}
