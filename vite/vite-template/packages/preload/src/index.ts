/**
 * @module preload
 */
import {contextBridge} from 'electron';
import type {BinaryLike} from 'crypto';
import {createHash} from 'crypto';

/**
 * "Main World" 是主渲染器代码运行的 JavaScript 上下文。
 * 默认情况下，在渲染器中加载的页面在这里执行代码。
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * 在分析了 `exposeInMainWorld` 调用之后，
 * `packages/preload/exposedInMainWorld.d.ts` 将生成文件
 * 它包含所有接口
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */

/**
 * 暴露环境版本
 * @example
 * console.log( window.versions )
 */
contextBridge.exposeInMainWorld('versions', process.versions);

/**
 * 安全公开 node.js API
 * @example
 * window.nodeCrypto('data')
 */
contextBridge.exposeInMainWorld('nodeCrypto', {
  sha256sum(data: BinaryLike) {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
  },
});