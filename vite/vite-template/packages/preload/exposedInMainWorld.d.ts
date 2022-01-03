interface Window {
  /**
   * 暴露环境版本
   * @example
   * console.log( window.versions )
   */
  readonly versions: NodeJS.ProcessVersions;
  /**
   * 安全公开 node.js API
   * @example
   * window.nodeCrypto('data')
   */
  readonly nodeCrypto: { sha256sum(data: import("crypto").BinaryLike): string; };
}
