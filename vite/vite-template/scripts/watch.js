#!/usr/bin/env node

const {createServer, build, createLogger } = require('vite');
const electronPath = require('electron');
const {spawn} = require('child_process');

/** @type 'production' | 'development'' */
const mode = process.env.MODE = process.env.MODE || 'development';

/** @type {import('vite').LogLevel} */
const LOG_LEVEL = 'info';

/** @type {import('vite').InlineConfig} */
const sharedConfig = {
  mode,
  build: {
    watch: {},
  },
  logLevel: LOG_LEVEL,
};

/** stderr 上与任何包含的模式匹配的消息将从输出中删除 */
const stderrFilterPatterns = [
  // 关于 devtools 扩展的警告
  // https://github.com/cawa-93/vite-electron-builder/issues/492
  // https://github.com/MarshallOfSound/electron-devtools-installer/issues/143
  /ExtensionLoadWarning/,
];

/**
 *
 * @param {{name: string; configFile: string; writeBundle: import('rollup').OutputPlugin['writeBundle'] }} param0
 * @returns {import('rollup').RollupWatcher}
 */
const getWatcher = ({name, configFile, writeBundle}) => {
  return build({
    ...sharedConfig,
    configFile,
    plugins: [{name, writeBundle}],
  });
};

/**
 * 更改源文件时启动或重新启动应用程序
 * @param {import('vite').ViteDevServer} viteDevServer
 * @returns {Promise<import('vite').RollupOutput | Array<import('vite').RollupOutput> | import('vite').RollupWatcher>}
 */
const setupMainPackageWatcher = (viteDevServer) => {
  // 将值写入环境变量以将其传递给主进程
  const protocol = `http${viteDevServer.config.server.https ? 's' : ''}:`;
  const host = viteDevServer.config.server.host || 'localhost';
  // Vite搜索并占用第一个自由端口：3000、3001、3002等
  const port = viteDevServer.config.server.port;
  const path = '/';
  process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;

  const logger = createLogger(LOG_LEVEL, {
    prefix: '[main]',
  });

  /** @type {ChildProcessWithoutNullStreams | null} */
  let spawnProcess = null;

  return getWatcher({
    name: 'reload-app-on-main-package-change',
    configFile: 'packages/main/vite.config.js',
    writeBundle() {
      if (spawnProcess !== null) {
        spawnProcess.kill('SIGINT');
        spawnProcess = null;
      }
      spawnProcess = spawn(String(electronPath), ['.']);
      spawnProcess.stdout.on('data', d => d.toString().trim() && logger.warn(d.toString(), {timestamp: true}));
      spawnProcess.stderr.on('data', d => {
        const data = d.toString().trim();
        if (!data) return;
        const mayIgnore = stderrFilterPatterns.some((r) => r.test(data));
        if (mayIgnore) return;
        logger.error(data, {timestamp: true});
      });
    },
  });
};

/**
 * 更改源文件时启动或重新启动应用程序
 * @param {import('vite').ViteDevServer} viteDevServer
 * @returns {Promise<import('vite').RollupOutput | Array<import('vite').RollupOutput> | import('vite').RollupWatcher>}
 */
const setupPreloadPackageWatcher = (viteDevServer) => {
  return getWatcher({
    name: 'reload-page-on-preload-package-change',
    configFile: 'packages/preload/vite.config.js',
    writeBundle() {
      viteDevServer.ws.send({
        type: 'full-reload',
      });
    },
  });
};

(async () => {
  try {
    const viteDevServer = await createServer({
      ...sharedConfig,
      configFile: 'packages/renderer/vite.config.js',
    });
    await viteDevServer.listen();
    await setupPreloadPackageWatcher(viteDevServer);
    await setupMainPackageWatcher(viteDevServer);
  }catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
