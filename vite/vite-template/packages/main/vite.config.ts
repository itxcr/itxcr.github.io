import {join} from 'path';
import {loadEnv} from 'vite';
import {builtinModules} from 'module';
const PACKAGE_ROOT = __dirname;

process.env = { ...process.env, ...loadEnv(process.env.MODE, process.cwd()) };
/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config ={
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: process.cwd(),
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  build: {
    sourcemap: 'inline',
    target: `node${process.env.VITE_NODE_VERSION}`,
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        'electron-devtools-installer',
        ...builtinModules,
      ],
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
