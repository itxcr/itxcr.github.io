import { defineConfig } from 'vite'
import { join } from 'path'
import { builtinModules } from 'module'

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, '../src/main'),
  build: {
    outDir: '../../dist/main',
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
    },
    minify: process.env.NODE_ENV === 'production',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        ...builtinModules,
        'electron',
      ],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
  }
})
