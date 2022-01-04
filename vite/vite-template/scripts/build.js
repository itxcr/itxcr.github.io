#!/usr/bin/env node
const {build} = require('vite');
const {dirname} = require('path');

/** @type 'production' | 'development' */
const mode = process.env.MODE = process.env.MODE || 'production';
const packagesConfigs = [
  'packages/main/vite.config.js',
  'packages/preload/vite.config.js',
  'packages/renderer/vite.config.js',
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
