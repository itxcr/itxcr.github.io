#!/usr/bin/env node
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const {build} = require('vite');
const {dirname} = require('path');

/** @type 'production' | 'development' */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mode = process.env.MODE = process.env.MODE || 'production';

const packagesConfigs = [
  'packages/main/vite.config.ts',
  'packages/preload/vite.config.ts',
  'packages/renderer/vite.config.ts',
];

/**
 * 为配置文件运行`vite build`
 */
const buildByConfig = (configFile) => build({configFile, mode});

(async () => {
  try {
    const totalTimeLabel = '总打包时间';
    console.time(totalTimeLabel);
    for (const packageConfigPath of packagesConfigs) {

      const consoleGroupName = `${dirname(packageConfigPath)}/`;
      console.group(consoleGroupName);

      const timeLabel = '打包时间';
      console.time(timeLabel);

      await buildByConfig(packageConfigPath);

      console.timeEnd(timeLabel);
      console.groupEnd();
      console.log('\n');
    }
    console.timeEnd(totalTimeLabel);
  }catch (e) {
    console.error(e);
    process.exit(1);
  }
})();