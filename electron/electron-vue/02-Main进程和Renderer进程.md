## 基本认识

![main](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109012006793.png)

Main进程管理的是这个 app 窗口（[BrowserWindow](https://electronjs.org/docs/api/browser-window)），而 Renderer 进程负责页面 UI渲染，不过实际上，它做的远远不止于此：

![202109012009522](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021112839.png)

它们由各自的模块，也有共同的模块。还有一部分是 Main 进程里的模块，不过可以通过 remote 模块，让 Renderer 进程也能使用。比如 Menu，比如 shell 等。

了解一下哪些模块在哪些进程里，哪些模块可以通过`remote`模块让renderer进程也能使用是有必要的，这样我们后续开发的时候才能正确的使用。

## Main 进程开发

```js
import { app, BrowserWindow } from 'electron' // 从electron引入app和BrowserWindow

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080` // 开发模式的话走webpack-dev-server的url
  : `file://${__dirname}/index.html`

function createWindow () { // 创建窗口
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  }) // 创建一个窗口

  mainWindow.loadURL(winURL) // 加载窗口的URL -> 来自renderer进程的页面

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow) // app准备好的时候创建窗口
```

在app准备好的时候打开一个窗口只需要调用一个创建`BrowserWindow`的方法即可。

### app

app模块是electron应用的骨架。它掌管着整个应用的生命周期钩子，以及很多其他事件钩子。app常用生命周期钩子如下：

- `will-finish-launching` 在应用完成基本启动进程之后触发
- `ready` 当electron完成初始化后触发
- `window-all-closed` 所有窗口都关闭的时候触发，在windows和linux里，所有窗口都退出的时候**通常**是应用退出的时候
- `before-quit` 退出应用之前的时候触发
- `will-quit` 即将退出应用的时候触发
- `quit` 应用退出的时候触发

而我们通常会在`ready`的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在`will-quit`或者`quit`的时候执行一些清空操作，比如解绑应用快捷键。

特别的，在非`macOS`的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以可以配合`window-all-closed`这个钩子来实现：

```js
app.on('window-all-closed', () => {  
    if (process.platform !== 'darwin') {
        // 当操作系统不是darwin（macOS）的话    
        app.quit() // 退出应用  
    }}
)
```

除了上面说的生命周期钩子之外，还有一些常用的事件钩子：

- `active`（仅macOS）当应用处于激活状态时
- `browser-window-created` 当一个BrowserWindow被创建的时候
- `browser-window-focus` 当一个BrowserWindow处于激活状态的时候

这些钩子需要配合一些具体场景来做出具体的操作。比如当一个BrowserWindow处于激活状态的时候修改窗口的title值。

当然，app这个模块除了上述的一些事件钩子之外，还有一些很常用的方法：

- `app.quit()` 用于退出应用
- `app.getPath(name)` 用于获取一些系统目录，对于存放应用的配置文件等很有用
- `app.focus()` 用于激活应用，不同系统激活逻辑[不一样](https://electronjs.org/docs/api/app#appfocus)

这些事件和方法都是怎么知道的呢？当然是[官方文档](https://electronjs.org/docs/)了。不过并不需要一开始就通读一遍官方的api文档。官方的api文档更多的作用是用来查阅，当你要开发到某个功能的时候再去查它能否有对应的api、怎么使用。

### BrowserWindow

BrowserWindow模块用于创建最常见的应用窗口。对于不同系统，创建的窗口的默认样式也不太一样。下面来看看macOS和windows的窗口在外观上的区别：

mac版的：

![202109012029825](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021115866.png)

windows版的：

![windows](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109012029808.png)

可以看到二者在窗口顶部的操作区（最小化、最大化、关闭）和标题的位置以及菜单的位置还是有明显的不同的。它们跟系统原生的窗口是一致的。

创建一个BrowserWindow的常用配置：

```js
let window

function createWindow () {
  window = new BrowserWindow({
    height: 900, // 高
    width: 400, // 宽
    show: false, // 创建后是否显示
    frame: false, // 是否创建frameless窗口
    fullscreenable: false, // 是否允许全屏
    center: true, // 是否出现在屏幕居中的位置
    backgroundColor: '#fff' // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'xxx' // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    transparent: true, // 是否是透明窗口（仅macOS）
    vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    webPreferences: {
      backgroundThrottling: false // 当页面被置于非激活窗口的时候是否停止动画和计时器
    }
    // ... 以及其他可选配置
  })

  window.loadURL(url)

  window.on('closed', () => { window = null })
}
```

窗口的长宽自然不必说，需要指定。其中需要注意的几个比较重要的就是，`frame`这个选项，默认是`true`。如果选择了`false`则会创建一个`frameless`[窗口](https://electronjs.org/docs/api/frameless-window)，创建一个没有顶部工具栏、没有border的窗口。这个也是我们在windows系统下自定义顶部栏的基础。

```js
const createSettingWindow = () => {
  const options = {
    height: 450,
    width: 800,
    show: false,
    frame: true,
    center: true,
    fullscreenable: false,
    resizable: false,
    title: 'PicGo',
    vibrancy: 'ultra-dark',
    transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      backgroundThrottling: false
    }
  }
  if (process.platform === 'win32') { // 针对windows平台做出不同的配置
    options.show = true // 创建即展示
    options.frame = false // 创建一个frameless窗口
    options.backgroundColor = '#3f3c37' // 背景色
  }
  settingWindow = new BrowserWindow(options)

  settingWindow.loadURL(settingWinURL)

  settingWindow.on('closed', () => {
    settingWindow = null
  })
}
```

跟`app`模块一样，`BrowserWindow`也有很多常用的事件钩子：

- `closed` 当窗口被关闭的时候
- `focus` 当窗口被激活的时候
- `show` 当窗口展示的时候
- `hide` 当窗口被隐藏的时候
- `maxmize` 当窗口最大化时
- `minimize` 当窗口最小化时

当然，也依然有很多实用的方法：

- `BrowserWindow.getFocusedWindow()` [静态方法]获取激活的窗口
- `win.close()` [实例方法，下同]关闭窗口
- `win.focus()` 激活窗口
- `win.show()` 显示窗口
- `win.hide()` 隐藏窗口
- `win.maximize()` 最大化窗口
- `win.minimize()` 最小化窗口
- `win.restore()` 从最小化窗口恢复

针对不同的业务逻辑你需要对窗口进行不一样的操作。这个需要跟你的项目需求相匹配。比如上述说到的，windows的顶部的操作区（放大、缩小、关闭按钮）就可以通过icon模拟+实例方法来实现。

### Tray

可以把它理解为不同系统的任务栏里的图标组件。

需要注意的是，windows和macOS里，图标的大小都是`16*16`px。macOS下顶部栏的图标通常都是走`黑白`路线，所以可以为两种系统分别准备不同的图标。`PicGo`里`Tray`的生成代码大致如下：

```js
function createTray () {
  const menubarPic = process.platform === 'darwin' ? 
        `${__static}/menubar.png` : `${__static}/menubar-nodarwin.png`
  tray = new Tray(menubarPic) // 指定图片的路径
  // ... 其他代码
}
```

注意上述代码里有一个`${__static}`的变量。该变量是`electron-vue`为我们暴露出来的项目根目录下的`static`文件夹的路径。通过这个路径，在开发和生产阶段都能很好的定位你的静态资源所在的目录。是个很方便的变量。

当然`Tray`并不只是一个图标而无其他作用了。Tray支持很多有用的事件。其中最关键的两个是`click`和`right-click`。分别对应鼠标左键点击和鼠标右键点击事件。

#### 鼠标左键点击事件

- 在macOS系统下，鼠标左键点击Tray的icon可能会出现配置菜单，也有可能会出现应用窗口。
- 在windows下，鼠标左键点击Tray的icon通常会出现应用的窗口。

#### 鼠标右键点击事件

- 在macOS系统下，鼠标右键点击Tray的icon通常会出现配置菜单。
- 在windows系统下，同上。

所以需要我们去适配不同操作系统下用户的操作习惯。

对应于PicGo而言，在macOS系统下左键点击会出现一个menubar的小窗口，右键点击会出现配置菜单。而在windows下，左键点击会直接出现主窗口，（因为在windows下无小窗口的必要），右键点击会出现配置菜单。它们在PicGo里的实现如下：

```js
function createTray () {
  const menubarPic = process.platform === 'darwin' ? `${__static}/menubar.png` : `${__static}/menubar-nodarwin.png`
  tray = new Tray(menubarPic)
  const contextMenu = // ...菜单
  tray.on('right-click', () => { // 右键点击
    window.hide() // 隐藏小窗口
    tray.popUpContextMenu(contextMenu) // 打开菜单
  })
  tray.on('click', () => { // 左键点击
    if (process.platform === 'darwin') { // 如果是macOS
      toggleWindow() // 打开或关闭小窗口
    } else { // 如果是windows
      window.hide() // 隐藏小窗口
      if (settingWindow === null) { // 如果主窗口不存在就创建一个
        createSettingWindow()
        settingWindow.show()
      } else { // 如果主窗口在，就显示并激活
        settingWindow.show()
        settingWindow.focus()
      }
    }
  })
}
```

对于macOS而言，Tray还有一个很棒的特性——可以拖拽文件到Tray的icon上，会触发如下事件：

- `drop` 当任何东西拖拽到icon上时
- `drop-files` 当文件被拖拽到icon上时
- `drop-text` 当文本被拖拽到icon上时
- `drop-enter` 当刚拖拽到icon上时
- `drop-leave` 当拖拽事件离开icon时
- `drop-end` 当拖拽事件结束时

就像PicGo实现的拖拽图片到Tray的icon上时实现图片上传的功能，就是用到了上述的一些事件：

![202109012050932](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021117408.gif)

尤其注意到在拖拽上的时候和拖拽结束后的时候icon是不一样的。在PicGo里是这样实现的，很简单：

```js
tray.on('drag-enter', () => {  tray.setImage(`${__static}/upload.png`)})
tray.on('drag-end', () => {  tray.setImage(`${__static}/menubar.png`)})
```

而`Tray`另一个重要的作用就是开启菜单项。

### Menu

electron威力强大的Menu组件，既能够生成系统菜单项，也能实现绑定应用常用快捷键的功能。

先来看看什么是系统菜单项：

macOS:

![202109012051122](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021118272.png)

windows:

![202109012053060](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021119662.png)

![2](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109012053502.png)

主要分两种:

- 第一种是app的菜单。对于macOS来说就是顶部栏左侧区域的菜单项。对于windows而言就是一个窗口的标题栏下方的菜单区。
- 第二种是类似于右键菜单的菜单。

第一种菜单可以通过`Menu.setApplicationMenu()`来实现。

第二种菜单可以通过两个步骤来展示：

**1.** 创建菜单：

```js
const contextMenu = Menu.buildFromTemplate([...])
```

**2.** 展示菜单：

```js
tray.on('right-click', () => { // 右键点击tray的时候
  tray.popUpContextMenu(contextMenu) // 弹出菜单
})
```

这里我们只介绍了`Menu`本身。其实组成`Menu`的是一个一个的`MenuItem`。它们有很多类型：

- normal
- separator
- submenu
- checkbox
- radio

以及很多角色

- quit
- copy
- redo
- undo
- minimize
- close
- reload

通常来说，配置的菜单项基本从类型里来组合。比如PicGo的菜单项：![3](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109012055495.png)

这里面就有normal、submenu、checkbox和radio四种类型。其中默认是normal。

角色的话通常对应的是一些常见的行为。比如`quit`是退出app，比如`minimize`是最小化，比如`copy`是复制。不过需要注意的是，如果你没有在创建app菜单里指定这些操作的快捷键的话，那么一些常见的快捷操作就无法在你的app里使用了。比如`ctrl+c`或者`command+c`复制这个操作，如果你没有通过`Menu.setApplicationMenu()`来设定这个快捷键的话，那么在你的electron应用里就无法执行复制的操作了。PicGo在早期版本里也犯了这个[错误](https://molunerfinn.com/electron-vue-2/)。当时的问题是我在开发模式下是没有问题的，但是在生产模式下就无法进行复制粘贴操作。后来查了一下原因，发现原来在开发模式下，electron会置入默认的一些快捷操作菜单，如图：![202109012057280](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021120964.png)

所以在生产模式如果我没有置入这些快捷键的话，使用者就无法使用了。**这个是大坑**。

说了这么多，来看看生成app的菜单的代码长啥样：

> 注意，如果在开发模式下直接只使用如下快捷键的话，一些调试快捷键比如`F12`或者`command+shift+i`打开控制台的操作就无法使用了。所以在开发模式下不需要创建这些快捷键菜单。

```js
const createMenu = () => {
  if (process.env.NODE_ENV !== 'development') {
    const template = [{
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click () {
            app.quit()
          }
        }
      ]
    }]
    menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
}
```

可以通过`accelerator`指定你想要的快捷键。诸如`Shift`、`Ctrl`、`Cmd`等键位缩写。如果是组合键，就加上`+`。尤其注意到，因为macOS和windows键位的差异，所以有一个很好用的键位缩写`CmdOrCtrl`，即如果是在macOS上就是`Cmd`，在windows上就是`Ctrl`。

然后再来看看Tray的“右键”菜单的生成：

```js
const contextMenu = Menu.buildFromTemplate([
   {
     label: '关于',
     click () {
       dialog.showMessageBox({
         title: 'PicGo',
         message: 'PicGo',
         detail: `Version: ${pkg.version}\nAuthor: Molunerfinn\nGithub: https://github.com/Molunerfinn/PicGo`
       })
     }
   },
   {
     label: '打开详细窗口',
     click () {
       if (settingWindow === null) {
         createSettingWindow()
         settingWindow.show()
       } else {
         settingWindow.show()
         settingWindow.focus()
       }
     }
   },
   {
     label: '选择默认图床',
     type: 'submenu',
     submenu: [
       {
         label: '微博图床',
         type: 'radio',
         checked: db.read().get('picBed.current').value() === 'weibo',
         click () {
           db.read().set('picBed.current', 'weibo')
             .write()
         }
       },
       {
         label: '七牛图床',
         type: 'radio',
         checked: db.read().get('picBed.current').value() === 'qiniu',
         click () {
           db.read().set('picBed.current', 'qiniu')
             .write()
         }
       },
       {
         label: '腾讯云COS',
         type: 'radio',
         checked: db.read().get('picBed.current').value() === 'tcyun',
         click () {
           db.read().set('picBed.current', 'tcyun')
             .write()
         }
       },
       {
         label: '又拍云图床',
         type: 'radio',
         checked: db.read().get('picBed.current').value() === 'upyun',
         click () {
           db.read().set('picBed.current', 'upyun')
             .write()
         }
       }
     ]
   },
   {
     label: '打开更新助手',
     type: 'checkbox',
     checked: db.get('picBed.showUpdateTip').value(),
     click () {
       const value = db.read().get('picBed.showUpdateTip').value()
       db.read().set('picBed.showUpdateTip', !value).write()
     }
   },
   {
     role: 'quit',
     label: '退出'
   }
 ])

 tray.on('right-click', () => {
   tray.popUpContextMenu(contextMenu)
 })
```

注意，菜单项的点击事件可以直接通过`click`属性来指定。上面我们是先通过了`Menu.buildFromTemplate()`这个方法创建了菜单，然后再在右键点击`Tray`图标的时候将其弹（PopUp)出来。

当然也有其他构建菜单的方法。可以通过Menu实例的`append`方法来加入`Menu Item`。如下例：

```js
const menu = new Menu()
menu.append(new MenuItem({ label: 'Cut', accelerator: 'CmdOrCtrl+X' }))
menu.append(new MenuItem({ type: 'separator' })) // 分割线
menu.append(new MenuItem({ label: 'Helper', type: 'checkbox', checked: true }))
```

基本上有了上述的几个基本模块，我们的一个应用的骨架是基本搭建好了，拥有窗口、任务栏应用图标和菜单项。其他的Main进程的模块，并不是必须的，当会用到的时候将在之后的文章里逐步提及。

### Renderer进程开发

对于`electron-vue`而言，renderer进程其实大部分就是在写我们平时常写的前端页面罢了。不过相对于平时在浏览器里写的页面，在electron里写页面的时候你还能用到不少非浏览器端的模块，比如`fs`，比如electron通过`remote`模块暴露给renderer进程的模块。接下去我们来看看renderer进程有哪些需要注意的地方。

#### 请使用Hash模式

往常我们在写Vue的时候都比较喜欢开启路由的`history`模式，因为这样在浏览器的地址栏上看起来比较好看——没有hash的`#`号，就如同请求后端的url一般。然而需要注意的是，`history`模式需要后端服务器的支持。

可能很多朋友平时开发的时候没有感觉，那是因为vue-cli里在开发模式下启动的`webpack-dev-server`帮你实现了服务端的`history-fallback`的特性。所以在实际部署的时候，至少都需要在你的web服务器程序诸如`nginx`、`apache`等配置相关的规则，让前端路由返回给`vue-router`去处理。

而electron里也是如此。在开发模式下，由于使用的是`webpack-dev-server`开启的服务器，所以`BrowserWindow`加载的是来自于类似`http://localhost:9080`这样的地址的页面。而在生产模式下，却是使用的`file://`的协议，比如`file://${__dirname}/index.html`来指定窗口加载的页面。

因此，从上面的表述你也能明白了。假如我有一个子路由地址为`child`。如果不启用Hash模式，在开发模式下没啥问题，`http://localhost:9080/child`，但是在生产模式下，`file://${__dirname}/index.html/child`却是无法匹配的一条路径。因此在electron下，`vue-router`请不要使用`history`模式，而使用默认的`hash`模式。

那么上面的问题就迎刃而解，变为`file://${__dirname}/index.html#child`即可。

PicGo里加载的页面路由规则如下，从中你也能看出我使用的是`hash`模式。

```js
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const settingWinURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#setting/upload`
  : `file://${__dirname}/index.html#setting/upload`
```

#### 实现自己的titlebar

在上面讲`BrowserWindow`的时候，我说到有时为了应用的美观，并不想让我们的应用窗口采用系统默认的`titlebar`，而想用自己写的来实现。这样的话就在创建你的`BrowserWindow`的配置里加上一句

```js
titleBarStyle: 'hidden'
```

这样就行了。然后你就可以自行在renderer进程的页面里模拟一个顶部的`titlebar`了，比如上面提到的`PicGo`的`titlebar`的样子。实际上代码也很简单：

```html
<div class="fake-title-bar">
  PicGo - {{ version }}
  <div class="handle-bar" v-if="os === 'win32'"> <!-- 如果是windows系统 就加上模拟的操作按钮-->
    <i class="el-icon-minus" @click="minimizeWindow"></i>
    <i class="el-icon-close" @click="closeWindow"></i>
  </div>
</div>
```

然后把这个titlebar的position置顶即可。

不过在平时的使用中，我们要注意，一般我们鼠标按住titlebar的时候是可以拖动窗口的。但是如果我们在不加可拖拽的属性之前，我们自己写的titlebar是不具备这样的特性的。要加上这个特性也很简单：

```css
.fake-title-bar {
  -webkit-app-region drag
}
```

只需一条CSS，即可让你的titlebar可以拖拽。

不过在windows下，操作区的按钮（缩小、放大、关闭）长按应该是不能拖拽的，所以还需要：

```css
.handle-bar {
  -webkit-app-region no-drag
}
```

变成`no-drag`，这样就实现了我们自己生成应用的titlebar了。

#### drag&drop的避免

通常我们用Chrome的时候，有个特性是比如你往Chrome里拖入一个pdf，它就会自动用内置的pdf阅读器打开。你往Chrome里拖入一张图片，它就会打开这张图片。由于我们的electron应用的`BrowserWindow`其实内部也是一个浏览器，所以这样的特性依然存在。而这也是很多人没有注意的地方。也就是当你开发完一个electron应用之后，往里拖入一张图片，一个pdf等等，如果不是一个可拖拽区域（比如PicGo的上传区），那么它就不应该打开这张图、这个pdf，而是将其排除在外。

所以我们将在全局监听`drag`和`drop`事件，当用户拖入一个文件但是又不是拖入可拖拽区域的时候，应该将其屏蔽掉。因为所有的页面都应该要有这样的特性，所以我写了一个vue的`mixin`：

```js
export default {
  mounted () {
    this.disableDragEvent()
  },
  methods: {
    disableDragEvent () {
      window.addEventListener('dragenter', this.disableDrag, false)
      window.addEventListener('dragover', this.disableDrag)
      window.addEventListener('drop', this.disableDrag)
    },
    disableDrag (e) {
      const dropzone = document.getElementById('upload-area') // 这个是可拖拽的上传区
      if (dropzone === null || !dropzone.contains(e.target)) {
        e.preventDefault()
        e.dataTransfer.effectAllowed = 'none'
        e.dataTransfer.dropEffect = 'none'
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('dragenter', this.disableDrag, false)
    window.removeEventListener('dragover', this.disableDrag)
    window.removeEventListener('drop', this.disableDrag)
  }
}
```

这样在全局引入这个mixin即可。

#### remote模块的使用

remote模块是electron为了让一些原本在Main进程里运行的模块也能在renderer进程里运行而创建的。以下说几个我们会用到的。

在`electron-vue`里内置了`vue-electron`这个模块，可以在vue里很方便的使用诸如`this.$electron.remote.xxx`来使用remote的模块。

##### shell

`shell`模块的官方说明是：`Manage files and URLs using their default applications.`也就是使用文件或者URL的默认应用。通常我们可以用其让默认图片应用打开一张图片、让默认浏览器打开一个url。

如果我们想在renderer进程里点击一个按钮然后在默认浏览器里打开一个url的话就可以这样：

```vue
<button @click="openURL"></button>
<script>  
    export default {    
        methods: {      
            openURL () { this.$electron.remote.shell.openExternal('https://github.com/Molunerfinn/PicGo')      
           }    
        }  
    }
</script>
```

更多详细的shell的用法可以参考[文档](https://electronjs.org/docs/api/shell)。

##### dialog

有的时候我们会有打开原生的对话框的需求。比如`PicGo`的版本信息：

mac：

![1](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021143875.png)

win：

![2](https://cdn.jsdelivr.net/gh/itxcr/oss/img/202109021143086.png)

这个时候就可以通过`dialog`这个模块来实现了。逻辑跟上面一样也是点击一个按钮打开一个dialog：

```js
openDialog () {
  this.$electron.remote.dialog.showMessageBox({
    title: 'PicGo',
    message: 'PicGo',
    detail: `Version: ${pkg.version}\nAuthor: Molunerfinn\nGithub: https://github.com/Molunerfinn/PicGo`
  })
}
```

更多详细的dialog的用法可以参考[文档](https://electronjs.org/docs/api/dialog)。

##### Menu和BrowserWindow的应用

使用`Menu`可能很多人能够理解。但是为什么要使用`BrowserWindow`呢？因为需要定位你打开`Menu`的窗口。

在PicGo里，有一个点击按钮打开Menu的操作，大致如下：

```js
buildMenu () {
    const template = [...]
    this.menu = Menu.buildFromTemplate(template)
  },
  openDialog () {
    this.menu.popup(remote.getCurrentWindow) // 获取当前打开Menu的窗口
  }
```

这里的`menu.popup`就需要你指定一下打开这个menu的窗口。它将自动定位你点击的位置而弹出。

#### main进程和renderer进程的通信

在Vue里，如果是非父子组件通信，很常用的是通过`Bus Event`来实现的。而electron里的不同进程间的通信其实也很类似，是通过`ipcMain`和`ipcRenderer`来实现的。其中`ipcMain`是在`main`进程里使用的，而`ipcRenderer`是在`renderer`进程里使用的。

##### ipcMain和ipcRenderer

```js
// In main process.
const {ipcMain} = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
})
```

```js
// In renderer process (web page).
const {ipcRenderer} = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {  
    console.log(arg) // prints "pong"
}) 

ipcRenderer.send('asynchronous-message', 'ping')
```

其中`ipcMain`只有监听来自`ipcRenderer`的某个事件后才能返回给`ipcRenderer`值。而`ipcRenderer`既可以收，也可以发。

那么问题就来了，如何让`ipcMain`主动发送消息呢？或者说让main进程主动发送消息给`ipcRenderer`。

首先要明确的是，`ipcMain`无法主动发消息给`ipcRenderer`。因为ipcMain只有`.on()`方法没有`.send()`的方法。所以只能用其他方法来实现。有办法么？有的，用`webContents`。

##### webContents

`webContents`其实是`BrowserWindow`实例的一个属性。也就是如果我们需要在`main`进程里给某个窗口某个页面发送消息，则必须通过`win.webContents.send()`方法来发送。

```js
// In main process
let win = new BrowserWindow({...})
win.webContents.send('img-files', imgs)
```

```js
// In renderer process
ipcRenderer.on('img-files', (event, files) => {
  console.log(files)
})
```

所以必须指定要发送的窗口，才能将信息准确送达。

