import {URL} from 'url';
import {app, shell} from 'electron';

/**
 * 允许在应用程序内部打开的来源列表以及每个来源的权限。
 *
 * 在开发模式下，需要允许打开`VITE_DEV_SERVER_URL`
 */
const ALLOWED_ORIGINS_AND_PERMISSIONS = new Map<string, Set<'clipboard-read' | 'media' | 'display-capture' | 'mediaKeySystem' | 'geolocation' | 'notifications' | 'midi' | 'midiSysex' | 'pointerLock' | 'fullscreen' | 'openExternal' | 'unknown'>>(
  import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL
    ? [[new URL(import.meta.env.VITE_DEV_SERVER_URL).origin, new Set]]
    : [],
);

/**
 * 允许在浏览器中打开的来源列表。
 * 只有在新窗口中打开链接时才能导航到下面的起源
 *
 * @example
 * <a
 *   target="_blank"
 *   href="https://github.com/"
 * >
 */
const ALLOWED_EXTERNAL_ORIGINS = new Set<`https://${string}`>([
  'https://vitejs.dev',
  'https://github.com',
  'https://v3.vuejs.org',
]);

app.on('web-contents-created', (_, contents) => {
  /**
   * 阻止导航到不在许可名单上的来源
   *
   * 导航是一种常见的攻击媒介。如果攻击者可以说服应用程序离开
   * 从其当前页面，他们可能会强制应用程序打开 Internet 上的网站。
   *
   * @see https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
   */
  contents.on('will-navigate', (event, url) => {
    const {origin} = new URL(url);
    if (ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)){
      return;
    }
    // 阻止导航
    event.preventDefault();
    if (import.meta.env.DEV) {
      console.warn(`阻止导航到不允许的来源: ${origin}`);
    }
  });

  /**
   * 阻止请求的不允许的权限。
   * 默认情况下，Electron 会自动批准所有权限请求。
   *
   * @see https://www.electronjs.org/docs/latest/tutorial/security#5-handle-session-permission-requests-from-remote-content
   */
  contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    const {origin} = new URL(webContents.getURL());
    const permissionGranted = !!ALLOWED_ORIGINS_AND_PERMISSIONS.get(origin)?.has(permission);
    callback(permissionGranted);
    if (!permissionGranted && import.meta.env.DEV) {
      console.warn(`${origin} 请求许可 ${permission}， 被阻止`);
    }
  });

  /**
   * 允许站点的超链接在默认浏览器中打开。
   *
   * 创建新的“webContents”是一种常见的攻击媒介。攻击者试图说服应用程序创建新窗口，
   * 帧或其他具有比以前更多特权的渲染器进程；或者打开了以前无法打开的页面。
   * 应该拒绝任何意外的窗口创建。
   *
   * @see https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
   * @see https://www.electronjs.org/docs/latest/tutorial/security#15-do-not-use-openexternal-with-untrusted-content
   */
  contents.setWindowOpenHandler(({url}) => {
    const {origin} = new URL(url);
    // @ts-expect-error Type checking is performed in runtime
    if (ALLOWED_EXTERNAL_ORIGINS.has(origin)) {
      // 打开默认浏览器
      shell.openExternal(url).catch(console.error);
    } else if (import.meta.env.DEV) {
      console.warn('阻止了一个不允许的来源的打开浏览器:', origin);
    }
    return { action: 'deny'};
  });

  /**
   * 在创建之前验证 webview 选项
   * 去除预加载脚本，禁用 Node.js 集成，并确保来源在许可名单中。
   * @see https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
   */
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    const {origin} = new URL(params.src);
    if (!ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
      if (import.meta.env.DEV) {
        console.warn(`一个 webview 试图访问 ${params.src},但被阻止了。`);
      }
      event.preventDefault();
      return;
    }
    // 删除未使用的预加载脚本或验证其位置是否合法
    delete webPreferences.preload;
    // @ts-expect-error `preloadURL` exists - see https://www.electronjs.org/docs/latest/api/web-contents#event-will-attach-webview
    delete webPreferences.preloadURL;
    // 禁用 Node.js 集成
    webPreferences.nodeIntegration = false;
  });
});
