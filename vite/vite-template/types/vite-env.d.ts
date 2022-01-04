/**
 *
 * 描述所有现有的环境变量及其类型
 * 代码完成和类型检查需要
 * 为了防止意外泄露 env 变量给客户端，只有以“VITE_”为前缀的变量才会暴露给你的 Vite 处理过的代码
 * 基本接口 https://github.com/vitejs/vite/blob/cab55b32de62e0de7d7789e8c2a1f04a8eae3a3f/packages/vite/types/importMeta.d.ts#L62-L69
 * Vite 环境变量文档 https://vitejs.dev/guide/env-and-mode.html#env-files
 */

interface ImportMetaEnv {
  /**
   * 该变量的值在 scripts/watch.ts 中设置并依赖于packages/main/vite.config.ts
   */
  VITE_DEV_SERVER_URL: undefined | string;
}
