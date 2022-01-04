import {join} from 'path';
import vue from '@vitejs/plugin-vue';
import {builtinModules} from 'module';
import {loadEnv} from 'vite';
const PACKAGE_ROOT = __dirname;

process.env = { ...process.env, ...loadEnv(process.env.MODE, process.cwd()) };
/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
    },
  },
  plugins: [vue()],
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${process.env.VITE_CHROME_VERSION}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      external: [
        ...builtinModules,
      ],
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
