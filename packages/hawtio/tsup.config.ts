import { defineConfig } from 'tsup'
import { readFileSync } from 'fs'
import { createRequire } from 'module'

/*
 * Use standard Node.js interop to create a 'require' function bound to this file.
 * This allows us to use 'require.resolve' to correctly locate hoisted packages
 * in the monorepo, which simple file paths cannot do reliably.
 *
 * Cannot use 'require' as word reserved by typescript compiler.
 */
const refRequire = createRequire(__filename)

export default defineConfig(() => {
  /*
   * Resolve PatternFly relative to this file
   * Climbs the directory tree, if required, to correctly find the PF core package
   */
  console.log(`Resolving @patternfly/react-core/package.json`)
  const pfPackagePath = refRequire.resolve('@patternfly/react-core/package.json')

  // Extract the PF version from the package
  const pfPackage = JSON.parse(readFileSync(pfPackagePath, 'utf-8'))
  const pfMajorVersion = parseInt(pfPackage.version, 10)

  console.log(`Building with PatternFly Major Version: ${pfMajorVersion}`)

  return {
    entry: ['src/index.ts', 'src/init.ts', 'src/ui/index.ts'],
    target: 'esnext',
    dts: true,
    sourcemap: true,
    format: 'cjs',
    splitting: true,
    loader: {
      // for SVG see:
      //  - https://github.com/hawtio/hawtio-react/issues/2088
      //  - https://github.com/evanw/esbuild/issues/4045
      '.svg': 'base64',
      '.jpg': 'dataurl',
      '.png': 'dataurl',
      '.md': 'text',
    },
    define: {
      'process.env.PATTERNFLY_MAJOR_VERSION': JSON.stringify(String(pfMajorVersion)),
    },
  }
})
