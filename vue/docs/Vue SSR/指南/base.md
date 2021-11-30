# Vue.js 服务器端渲染指南

## 什么是服务器端渲染 (SSR)？

Vue.js 是构建客户端应用程序的框架。默认情况下，可以在浏览器中输出 Vue 组件，进行生成 DOM 和操作 DOM。然而，也可以将同一个组件渲染为服务器端的 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

服务器渲染的 Vue.js 应用程序也可以被认为是"同构"或"通用"，因为应用程序的大部分代码都可以在**服务器**和**客户端**上运行。

## 为什么使用服务器端渲染 (SSR)？

与传统 SPA (单页应用程序 (Single-Page Application)) 相比，服务器端渲染 (SSR) 的优势主要在于：

- 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。

  请注意，截至目前，Google 和 Bing 可以很好对同步 JavaScript 应用程序进行索引。在这里，同步是关键。如果你的应用程序初始展示 loading 菊花图，然后通过 Ajax 获取内容，抓取工具并不会等待异步完成后再行抓取页面内容。也就是说，如果 SEO 对你的站点至关重要，而你的页面又是异步获取内容，则你可能需要服务器端渲染(SSR)解决此问题。

- 更快的内容到达时间 (time-to-content)，特别是对于缓慢的网络情况或运行缓慢的设备。无需等待所有的 JavaScript 都完成下载并执行，才显示服务器渲染的标记，所以你的用户将会更快速地看到完整渲染的页面。通常可以产生更好的用户体验，并且对于那些「内容到达时间(time-to-content) 与转化率直接相关」的应用程序而言，服务器端渲染 (SSR) 至关重要。

使用服务器端渲染 (SSR) 时还需要有一些权衡之处：

- 开发条件所限。浏览器特定的代码，只能在某些生命周期钩子函数 (lifecycle hook) 中使用；一些外部扩展库 (external library) 可能需要特殊处理，才能在服务器渲染应用程序中运行。
- 涉及构建设置和部署的更多要求。与可以部署在任何静态文件服务器上的完全静态单页面应用程序 (SPA) 不同，服务器渲染应用程序，需要处于 Node.js server 运行环境。
- 更多的服务器端负载。在 Node.js 中渲染完整的应用程序，显然会比仅仅提供静态文件的 server 更加大量占用 CPU 资源 (CPU-intensive - CPU 密集)，因此如果你预料在高流量环境 (high traffic) 下使用，请准备相应的服务器负载，并明智地采用缓存策略。

在对你的应用程序使用服务器端渲染 (SSR) 之前，你应该问的第一个问题是，是否真的需要它。这主要取决于内容到达时间 (time-to-content) 对应用程序的重要程度。例如，如果你正在构建一个内部仪表盘，初始加载时的额外几百毫秒并不重要，这种情况下去使用服务器端渲染 (SSR) 将是一个小题大作之举。然而，内容到达时间 (time-to-content) 要求是绝对关键的指标，在这种情况下，服务器端渲染 (SSR) 可以帮助你实现最佳的初始加载性能。

## 服务器端渲染 vs 预渲染 (SSR vs Prerendering)

如果你调研服务器端渲染 (SSR) 只是用来改善少数营销页面（例如 `/`, `/about`, `/contact` 等）的 SEO，那么你可能需要**预渲染**。无需使用 web 服务器实时动态编译 HTML，而是使用预渲染方式，在构建时 (build time) 简单地生成针对特定路由的静态 HTML 文件。优点是设置预渲染更简单，并可以将你的前端作为一个完全静态的站点。

如果你使用 webpack，你可以使用 [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) 轻松地添加预渲染。它已经被 Vue 应用程序广泛测试 - 事实上，[作者](https://github.com/chrisvfritz)是 Vue 核心团队的成员。

## 关于此指南

本指南专注于，使用 Node.js server 的服务器端单页面应用程序渲染。将 Vue 服务器端渲染 (SSR) 与其他后端设置进行混合使用，是后端自身集成 SSR 的话题，我们会在 [专门章节](https://ssr.vuejs.org/zh/guide/non-node.html) 中进行简要讨论。

本指南将会非常深入，并且假设你已经熟悉 Vue.js 本身，并且具有 Node.js 和 webpack 的相当不错的应用经验。如果你倾向于使用提供了平滑开箱即用体验的更高层次解决方案，你应该去尝试使用 [Nuxt.js](https://nuxtjs.org/)。它建立在同等的 Vue 技术栈之上，但抽象出很多模板，并提供了一些额外的功能，例如静态站点生成。但是，如果你需要更直接地控制应用程序的结构，Nuxt.js 并不适合这种使用场景。无论如何，阅读本指南将更有助于更好地了解一切如何运行。

当你阅读时，参考官方 [HackerNews Demo](https://github.com/vuejs/vue-hackernews-2.0/) 将会有所帮助，此示例使用了本指南涵盖的大部分技术。

最后，请注意，本指南中的解决方案不是限定的 - 我们发现它们对我们来说很好，但这并不意味着无法继续改进。可能会在未来持续改进，欢迎通过随意提交 pull request 作出贡献！

# 基本用法

## 安装

```bash
npm install vue vue-server-renderer --save
```

我们将在整个指南中使用 NPM，但你也可以使用 [Yarn](https://yarnpkg.com/en/)。

#### 注意

- 推荐使用 Node.js 版本 6+。
- `vue-server-renderer` 和 `vue` 必须匹配版本。
- `vue-server-renderer` 依赖一些 Node.js 原生模块，因此只能在 Node.js 中使用。我们可能会提供一个更简单的构建，可以在将来在其他「JavaScript 运行时(runtime)」运行。

## 渲染一个 Vue 实例

```js
// 第 1 步：创建一个 Vue 实例
const Vue = require('vue')
const app = new Vue({
  template: `<div>Hello World</div>`
})

// 第 2 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer()

// 第 3 步：将 Vue 实例渲染为 HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
  // => <div data-server-rendered="true">Hello World</div>
})

// 在 2.5.0+，如果没有传入回调函数，则会返回 Promise：
renderer.renderToString(app).then(html => {
  console.log(html)
}).catch(err => {
  console.error(err)
})
```

## 与服务器集成

在 Node.js 服务器中使用时相当简单直接，例如 [Express](https://expressjs.com/)：

```bash
npm install express --save
```

```js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```

## 使用一个页面模板

当你在渲染 Vue 应用程序时，renderer 只从应用程序生成 HTML 标记 (markup)。在这个示例中，我们必须用一个额外的 HTML 页面包裹容器，来包裹生成的 HTML 标记。

为了简化这些，你可以直接在创建 renderer 时提供一个页面模板。多数时候，我们会将页面模板放在特有的文件中，例如 `index.template.html`：

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

注意 `<!--vue-ssr-outlet-->` 注释 -- 这里将是应用程序 HTML 标记注入的地方。

然后，我们可以读取和传输文件到 Vue renderer 中

```js
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

renderer.renderToString(app, (err, html) => {
  console.log(html) // html 将是注入应用程序内容的完整页面
})
```

### 模板插值

模板还支持简单插值。给定如下模板：

```html
<html>
  <head>
    <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>

    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
    {{{ meta }}}
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

我们可以通过传入一个"渲染上下文对象"，作为 `renderToString` 函数的第二个参数，来提供插值数据：

```js
const context = {
  title: 'hello',
  meta: `
    <meta ...>
    <meta ...>
  `
}

renderer.renderToString(app, context, (err, html) => {
  // 页面 title 将会是 "Hello"
  // meta 标签也会注入
})
```

也可以与 Vue 应用程序实例共享 `context` 对象，允许模板插值中的组件动态地注册数据。

此外，模板支持一些高级特性，例如：

- 在使用 `*.vue` 组件时，自动注入「关键的 CSS(critical CSS)」；
- 在使用 `clientManifest` 时，自动注入「资源链接(asset links)和资源预加载提示(resource hints)」；
- 在嵌入 Vuex 状态进行客户端融合(client-side hydration)时，自动注入以及 XSS 防御。

## 完整实例代码

```js
const Vue = require('vue');
const server = require('express')();

const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const renderer = require('vue-server-renderer').createRenderer({
  template,
});

const context = {
    title: 'vue ssr',
    metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`,
  });

  renderer
  .renderToString(app, context, (err, html) => {
    console.log(html);
    if (err) {
      res.status(500).end('Internal Server Error')
      return;
    }
    res.end(html);
  });
})

server.listen(8080);
```

# 编写通用代码

在进一步介绍之前，让我们花点时间来讨论编写"通用"代码时的约束条件 - 即运行在服务器和客户端的代码。由于用例和平台 API 的差异，当运行在不同环境中时，我们的代码将不会完全相同。所以这里我们将会阐述你需要理解的关键事项。

## 服务器上的数据响应

在纯客户端应用程序 (client-only app) 中，每个用户会在他们各自的浏览器中使用新的应用程序实例。对于服务器端渲染，我们也希望如此：每个请求应该都是全新的、独立的应用程序实例，以便不会有交叉请求造成的状态污染 (cross-request state pollution)。

因为实际的渲染过程需要确定性，所以我们也将在服务器上“预取”数据 ("pre-fetching" data) - 这意味着在我们开始渲染时，我们的应用程序就已经解析完成其状态。也就是说，将数据进行响应式的过程在服务器上是多余的，所以默认情况下禁用。禁用响应式数据，还可以避免将「数据」转换为「响应式对象」的性能开销。

## 组件生命周期钩子函数

由于没有动态更新，所有的生命周期钩子函数中，只有 `beforeCreate` 和 `created` 会在服务器端渲染 (SSR) 过程中被调用。这就是说任何其他生命周期钩子函数中的代码（例如 `beforeMount` 或 `mounted`），只会在客户端执行。

此外还需要注意的是，你应该避免在 `beforeCreate` 和 `created` 生命周期时产生全局副作用的代码，例如在其中使用 `setInterval` 设置 timer。在纯客户端 (client-side only) 的代码中，我们可以设置一个 timer，然后在 `beforeDestroy` 或 `destroyed` 生命周期时将其销毁。但是，由于在 SSR 期间并不会调用销毁钩子函数，所以 timer 将永远保留下来。为了避免这种情况，请将副作用代码移动到 `beforeMount` 或 `mounted` 生命周期中。

## 访问特定平台(Platform-Specific) API

通用代码不可接受特定平台的 API，因此如果你的代码中，直接使用了像 `window` 或 `document`，这种仅浏览器可用的全局变量，则会在 Node.js 中执行时抛出错误，反之也是如此。

对于共享于服务器和客户端，但用于不同平台 API 的任务(task)，建议将平台特定实现包含在通用 API 中，或者使用为你执行此操作的 library。例如，[axios](https://github.com/axios/axios) 是一个 HTTP 客户端，可以向服务器和客户端都暴露相同的 API。

对于仅浏览器可用的 API，通常方式是，在「纯客户端 (client-only)」的生命周期钩子函数中惰性访问 (lazily access) 它们。

请注意，考虑到如果第三方 library 不是以上面的通用用法编写，则将其集成到服务器渲染的应用程序中，可能会很棘手。你*可能*要通过模拟 (mock) 一些全局变量来使其正常运行，但这只是 hack 的做法，并且可能会干扰到其他 library 的环境检测代码。

## 自定义指令

大多数自定义指令直接操作 DOM，因此会在服务器端渲染 (SSR) 过程中导致错误。有两种方法可以解决这个问题：

1. 推荐使用组件作为抽象机制，并运行在「虚拟 DOM 层级(Virtual-DOM level)」（例如，使用渲染函数(render function)）。
2. 如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 [`directives`](https://ssr.vuejs.org/zh/api/#directives) 选项所提供"服务器端版本(server-side version)"。

# 源码结构

## 避免状态单例

当编写纯客户端 (client-only) 代码时，我们习惯于每次在新的上下文中对代码进行取值。但是，Node.js 服务器是一个长期运行的进程。当我们的代码进入该进程时，它将进行一次取值并留存在内存中。这意味着如果创建一个单例对象，它将在每个传入的请求之间共享。

如基本示例所示，我们**为每个请求创建一个新的根 Vue 实例**。这与每个用户在自己的浏览器中使用新应用程序的实例类似。如果我们在多个请求之间使用一个共享的实例，很容易导致交叉请求状态污染 (cross-request state pollution)。

因此，我们不应该直接创建一个应用程序实例，而是应该暴露一个可以重复执行的工厂函数，为每个请求创建新的应用程序实例：

```js
// app.js
const Vue = require('vue')

module.exports = function createApp (context) {
  return new Vue({
    data: {
      url: context.url
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`
  })
}
```

并且我们的服务器代码现在变为：

```js
// server.js
const createApp = require('./app')

server.get('*', (req, res) => {
  const context = { url: req.url }
  const app = createApp(context)

  renderer.renderToString(app, (err, html) => {
    // 处理错误……
    res.end(html)
  })
})
```

同样的规则也适用于 router、store 和 event bus 实例。你不应该直接从模块导出并将其导入到应用程序中，而是需要在 `createApp` 中创建一个新的实例，并从根 Vue 实例注入。

在使用带有 `{ runInNewContext: true }` 的 bundle renderer 时，可以消除此约束，但是由于需要为每个请求创建一个新的 vm 上下文，因此伴随有一些显著性能开销。

## 介绍构建步骤

到目前为止，我们还没有讨论过如何将相同的 Vue 应用程序提供给客户端。为了做到这一点，我们需要使用 webpack 来打包我们的 Vue 应用程序。事实上，我们可能需要在服务器上使用 webpack 打包 Vue 应用程序，因为：

- 通常 Vue 应用程序是由 webpack 和 `vue-loader` 构建，并且许多 webpack 特定功能不能直接在 Node.js 中运行（例如通过 `file-loader` 导入文件，通过 `css-loader` 导入 CSS）。
- 尽管 Node.js 最新版本能够完全支持 ES2015 特性，我们还是需要转译客户端代码以适应老版浏览器。这也会涉及到构建步骤。

所以基本看法是，对于客户端应用程序和服务器应用程序，我们都要使用 webpack 打包 - 服务器需要「服务器 bundle」然后用于服务器端渲染(SSR)，而「客户端 bundle」会发送给浏览器，用于混合静态标记。

<img src="https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png" alt="架构"  />

## 使用 webpack 的源码结构

现在我们正在使用 webpack 来处理服务器和客户端的应用程序，大部分源码可以使用通用方式编写，可以使用 webpack 支持的所有功能。同时，在编写通用代码时，有一些[事项](https://ssr.vuejs.org/zh/guide/universal.html)要牢记在心。

一个基本项目可能像是这样：

```bash
src
├── components
│   ├── Foo.vue
│   ├── Bar.vue
│   └── Baz.vue
├── App.vue
├── app.js # 通用 entry(universal entry)
├── entry-client.js # 仅运行于浏览器
└── entry-server.js # 仅运行于服务器
```

### `app.js`

`app.js` 是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。`app.js` 简单地使用 export 导出一个 `createApp` 函数：

```js
import Vue from 'vue'
import App from './App.vue'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app }
}
```

### `entry-client.js`:

客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中：

```js
import { createApp } from './app'

// 客户端特定引导逻辑……

const { app } = createApp()

// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app')
```

### `entry-server.js`:

服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。

```js
import { createApp } from './app'

export default context => {
  const { app } = createApp()
  return app
}
```

# 路由和代码分割

## 使用 `vue-router` 的路由

你可能已经注意到，我们的服务器代码使用了一个 `*` 处理程序，它接受任意 URL。这允许我们将访问的 URL 传递到我们的 Vue 应用程序中，然后对客户端和服务器复用相同的路由配置！

为此，建议使用官方提供的 `vue-router`。我们首先创建一个文件，在其中创建 router。注意，类似于 `createApp`，我们也需要给每个请求一个新的 router 实例，所以文件导出一个 `createRouter` 函数：

```js
// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      // ...
    ]
  })
}
```

然后更新 `app.js`:

```js
// app.js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export function createApp () {
  // 创建 router 实例
  const router = createRouter()

  const app = new Vue({
    // 注入 router 到根 Vue 实例
    router,
    render: h => h(App)
  })

  // 返回 app 和 router
  return { app, router }
}
```

现在我们需要在 `entry-server.js` 中实现服务器端路由逻辑 (server-side routing logic)：

```js
// entry-server.js
import { createApp } from './app'

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      resolve(app)
    }, reject)
  })
}
```

假设服务器 bundle 已经完成构建（请再次忽略现在的构建设置），服务器用法看起来如下：

```js
// server.js
const createApp = require('/path/to/built-server-bundle.js')

server.get('*', (req, res) => {
  const context = { url: req.url }

  createApp(context).then(app => {
    renderer.renderToString(app, (err, html) => {
      if (err) {
        if (err.code === 404) {
          res.status(404).end('Page not found')
        } else {
          res.status(500).end('Internal Server Error')
        }
      } else {
        res.end(html)
      }
    })
  })
})
```

## 代码分割

应用程序的代码分割或惰性加载，有助于减少浏览器在初始渲染中下载的资源体积，可以极大地改善大体积 bundle 的可交互时间(TTI - time-to-interactive)。这里的关键在于，对初始首屏而言，"只加载所需"。

Vue 提供异步组件作为第一类的概念，将其与 [webpack 2 所支持的使用动态导入作为代码分割点](https://webpack.js.org/guides/code-splitting-async/)相结合，你需要做的是：

```js
// 这里进行修改……
import Foo from './Foo.vue'

// 改为这样：
const Foo = () => import('./Foo.vue')
```

在 Vue 2.5 以下的版本中，服务端渲染时异步组件只能用在路由组件上。然而在 2.5+ 的版本中，得益于核心算法的升级，异步组件现在可以在应用中的任何地方使用。

需要注意的是，你仍然需要在挂载 app 之前调用 `router.onReady`，因为路由器必须要提前解析路由配置中的异步组件，才能正确地调用组件中可能存在的路由钩子。这一步我们已经在我们的服务器入口 (server entry) 中实现过了，现在我们只需要更新客户端入口 (client entry)：

```js
// entry-client.js

import { createApp } from './app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})
```

异步路由组件的路由配置示例：

```js
// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: () => import('./components/Home.vue') },
      { path: '/item/:id', component: () => import('./components/Item.vue') }
    ]
  })
}
```

# 数据预取和状态

## 数据预取存储容器 (Data Store)

在服务器端渲染(SSR)期间，我们本质上是在渲染我们应用程序的"快照"，所以如果应用程序依赖于一些异步数据，**那么在开始渲染过程之前，需要先预取和解析好这些数据**。

另一个需要关注的问题是在客户端，在挂载 (mount) 到客户端应用程序之前，需要获取到与服务器端应用程序完全相同的数据 - 否则，客户端应用程序会因为使用与服务器端应用程序不同的状态，然后导致混合失败。

为了解决这个问题，获取的数据需要位于视图组件之外，即放置在专门的数据预取存储容器(data store)或"状态容器(state container)"中。首先，在服务器端，我们可以在渲染之前预取数据，并将数据填充到 store 中。此外，我们将在 HTML 中序列化(serialize)和内联预置(inline)状态。这样，在挂载(mount)到客户端应用程序之前，可以直接从 store 获取到内联预置(inline)状态。

为此，我们将使用官方状态管理库 [Vuex](https://github.com/vuejs/vuex/)。我们先创建一个 `store.js` 文件，里面会模拟一些根据 id 获取 item 的逻辑：

```js
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）
import { fetchItem } from './api'

export function createStore () {
  return new Vuex.Store({
    state: {
      items: {}
    },
    actions: {
      fetchItem ({ commit }, id) {
        // `store.dispatch()` 会返回 Promise，
        // 以便我们能够知道数据在何时更新
        return fetchItem(id).then(item => {
          commit('setItem', { id, item })
        })
      }
    },
    mutations: {
      setItem (state, { id, item }) {
        Vue.set(state.items, id, item)
      }
    }
  })
}
```

然后修改 `app.js`：

```js
// app.js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

export function createApp () {
  // 创建 router 和 store 实例
  const router = createRouter()
  const store = createStore()

  // 同步路由状态(route state)到 store
  sync(store, router)

  // 创建应用程序实例，将 router 和 store 注入
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // 暴露 app, router 和 store。
  return { app, router, store }
}
```

## 带有逻辑配置的组件 (Logic Collocation with Components)

那么，我们在哪里放置「dispatch 数据预取 action」的代码？

我们需要通过访问路由，来决定获取哪部分数据 - 这也决定了哪些组件需要渲染。事实上，给定路由所需的数据，也是在该路由上渲染组件时所需的数据。所以在路由组件中放置数据预取逻辑，是很自然的事情。

我们将在路由组件上暴露出一个自定义静态函数 `asyncData`。注意，由于此函数会在组件实例化之前调用，所以它无法访问 `this`。需要将 store 和路由信息作为参数传递进去：

```html
<!-- Item.vue -->
<template>
  <div>{{ item.title }}</div>
</template>

<script>
export default {
  asyncData ({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch('fetchItem', route.params.id)
  },
  computed: {
    // 从 store 的 state 对象中的获取 item。
    item () {
      return this.$store.state.items[this.$route.params.id]
    }
  }
}
</script>
```

## 服务器端数据预取 (Server Data Fetching)

在 `entry-server.js` 中，我们可以通过路由获得与 `router.getMatchedComponents()` 相匹配的组件，如果组件暴露出 `asyncData`，我们就调用这个方法。然后我们需要将解析完成的状态，附加到渲染上下文(render context)中。

```js
// entry-server.js
import { createApp } from './app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state

        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
```

当使用 `template` 时，`context.state` 将作为 `window.__INITIAL_STATE__` 状态，自动嵌入到最终的 HTML 中。而在客户端，在挂载到应用程序之前，store 就应该获取到状态：

```js
// entry-client.js

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
```

## 客户端数据预取 (Client Data Fetching)

在客户端，处理数据预取有两种不同方式：

1. **在路由导航之前解析数据：**

   使用此策略，应用程序会等待视图所需数据全部解析之后，再传入数据并处理当前视图。好处在于，可以直接在数据准备就绪时，传入视图渲染完整内容，但是如果数据预取需要很长时间，用户在当前视图会感受到"明显卡顿"。因此，如果使用此策略，建议提供一个数据加载指示器 (data loading indicator)。

   我们可以通过检查匹配的组件，并在全局路由钩子函数中执行 `asyncData` 函数，来在客户端实现此策略。注意，在初始路由准备就绪之后，我们应该注册此钩子，这样我们就不必再次获取服务器提取的数据。

   ```js
   // entry-client.js
   
   // ...忽略无关代码
   
   router.onReady(() => {
     // 添加路由钩子函数，用于处理 asyncData.
     // 在初始路由 resolve 后执行，
     // 以便我们不会二次预取(double-fetch)已有的数据。
     // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
     router.beforeResolve((to, from, next) => {
       const matched = router.getMatchedComponents(to)
       const prevMatched = router.getMatchedComponents(from)
   
       // 我们只关心非预渲染的组件
       // 所以我们对比它们，找出两个匹配列表的差异组件
       let diffed = false
       const activated = matched.filter((c, i) => {
         return diffed || (diffed = (prevMatched[i] !== c))
       })
   
       if (!activated.length) {
         return next()
       }
   
       // 这里如果有加载指示器 (loading indicator)，就触发
   
       Promise.all(activated.map(c => {
         if (c.asyncData) {
           return c.asyncData({ store, route: to })
         }
       })).then(() => {
   
         // 停止加载指示器(loading indicator)
   
         next()
       }).catch(next)
     })
   
     app.$mount('#app')
   })
   ```

2. **匹配要渲染的视图后，再获取数据：**

   此策略将客户端数据预取逻辑，放在视图组件的 `beforeMount` 函数中。当路由导航被触发时，可以立即切换视图，因此应用程序具有更快的响应速度。然而，传入视图在渲染时不会有完整的可用数据。因此，对于使用此策略的每个视图组件，都需要具有条件加载状态。

   这可以通过纯客户端 (client-only) 的全局 mixin 来实现：

   ```js
   Vue.mixin({
     beforeMount () {
       const { asyncData } = this.$options
       if (asyncData) {
         // 将获取数据操作分配给 promise
         // 以便在组件中，我们可以在数据准备就绪后
         // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
         this.dataPromise = asyncData({
           store: this.$store,
           route: this.$route
         })
       }
     }
   })
   ```

   这两种策略是根本上不同的用户体验决策，应该根据你创建的应用程序的实际使用场景进行挑选。但是无论你选择哪种策略，当路由组件重用（同一路由，但是 params 或 query 已更改，例如，从 `user/1` 到 `user/2`）时，也应该调用 `asyncData` 函数。我们也可以通过纯客户端 (client-only) 的全局 mixin 来处理这个问题：

   ```js
   Vue.mixin({
     beforeRouteUpdate (to, from, next) {
       const { asyncData } = this.$options
       if (asyncData) {
         asyncData({
           store: this.$store,
           route: to
         }).then(next).catch(next)
       } else {
         next()
       }
     }
   })
   ```

## Store 代码拆分 (Store Code Splitting)

在大型应用程序中，我们的 Vuex store 可能会分为多个模块。当然，也可以将这些模块代码，分割到相应的路由组件 chunk 中。假设我们有以下 store 模块：

```js
// store/modules/foo.js
export default {
  namespaced: true,
  // 重要信息：state 必须是一个函数，
  // 因此可以创建多个实例化该模块
  state: () => ({
    count: 0
  }),
  actions: {
    inc: ({ commit }) => commit('inc')
  },
  mutations: {
    inc: state => state.count++
  }
}
```

我们可以在路由组件的 `asyncData` 钩子函数中，使用 `store.registerModule` 惰性注册(lazy-register)这个模块：

```html
// 在路由组件内
<template>
  <div>{{ fooCount }}</div>
</template>

<script>
// 在这里导入模块，而不是在 `store/index.ts` 中
import fooStoreModule from '../store/modules/foo'

export default {
  asyncData ({ store }) {
    store.registerModule('foo', fooStoreModule)
    return store.dispatch('foo/inc')
  },

  // 重要信息：当多次访问路由时，
  // 避免在客户端重复注册模块。
  destroyed () {
    this.$store.unregisterModule('foo')
  },

  computed: {
    fooCount () {
      return this.$store.state.foo.count
    }
  }
}
</script>
```

由于模块现在是路由组件的依赖，所以它将被 webpack 移动到路由组件的异步 chunk 中。

