import {app, BrowserWindow} from 'electron';
import {join} from 'path';
import {URL} from 'url';
import './security-restrictions';

let mainWindow: BrowserWindow | null = null;
async function createOrRestoreWindow() {
  // 如果窗口已经存在就显示它
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    // 使用 'ready-to-show' 事件来显示窗口
    show: false,
    webPreferences: {
      nativeWindowOpen: true,
      // 不推荐使用 webview 标签。
      // 考虑像 iframe 或 Electron 的 BrowserView 这样的替代品。 https://www.electronjs.org/docs/latest/api/webview-tag#warning
      webviewTag: false,
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
  });

  /**
   * 如果你安装了`show: true`，那么它会在尝试关闭窗口时导致问题。
   * 使用 `show: false` 和侦听器事件 `ready-to-show` 来解决这些问题。
   * @see https://github.com/electron/electron/issues/25012
   */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    if (import.meta.env.DEV) {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
   * 主窗口的 URL
   * 用于开发的 Vite 开发服务器。
   * `file://../renderer/index.html` 用于生产和测试
   */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

  await mainWindow.loadURL(pageUrl);
}

/**
 * 防止多个实例
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', createOrRestoreWindow);

/**
 * 禁用硬件加速以更省电
 */
app.disableHardwareAcceleration();

/**
 * 如果所有窗口都关闭，则关闭后台进程
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * 当后台进程准备好时创建应用程序窗口
 */
app.whenReady()
  .then(createOrRestoreWindow)
  .catch((e) => console.error('创建窗口失败', e));

/**
 * 仅在开发模式下安装 Vue.js 或其他一些开发工具
 */
if (import.meta.env.DEV) {
  app.whenReady()
    .then(() => import('electron-devtools-installer'))
    .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
      loadExtensionOptions: {
        allowFileAccess: true,
      },
    }))
    .catch(e => console.error('安装扩展失败', e));
}

/**
 * 仅在生产模式下检查新的应用程序版本
 */
// if (import.meta.env.PROD) {
//   app.whenReady()
//     .then(() => import('electron-updater'))
//     .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
//     .catch((e) => console.error('更新检测失败', e));
// }
