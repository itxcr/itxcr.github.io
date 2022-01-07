## 制作 vite + vue3 + Electron 整合框架

### 依赖包

- electron

  使用 JavaScript，HTML 和 CSS 构建跨平台的桌面应用程序

- electron-builder

  Electron Builder 是一个完备的Electron应用打包和分发解决方案，它致力于软件开发的集成体验

- electron-devtools-installer

  加载 DevTools 扩展的最简单方法是使用第三方工具，来实现自动化过程。 [electron-devtools-installer](https://github.com/MarshallOfSound/electron-devtools-installer) 是一个受欢迎的 NPM 包

- electron-updater

  使应用程序能够自动更新
  
- cross-env

  运行跨平台设置和使用环境变量(Node中的环境变量)的脚本

- [nano-staged](https://github.com/usmanyunusov/nano-staged#readme)

  相较 `lint-staged`提高性能

  细致的配置还是要使用 `lint-staged` 

- eslint

  检测JS代码质量

- eslint-plugin-vue

  代码格式规则遵循最新的 Vue 建议和最佳实践

- @typescript-eslint/eslint-plugin

  代码格式化规则遵循最新的 TypeScript 建议和最佳实践，提供相应的 rule，让 ESLint 能够识别。同时为了避免冲突，在手动开启该 plugin 的某些规则时，需要将 ESLint 当中的一些规则关闭

- @typescript-eslint/parser

  ESLint 会对我们的代码进行校验，而 parser 的作用是将我们写的代码转换为 [ESTree](https://link.zhihu.com/?target=https%3A//github.com/estree/estree)，ESLint 会对 ESTree 进行校验。

- dts-for-context-bridge

  自动为所有传递给 的 API 创建接口声明`electron.contextBridge.exposeInMainWorld`

### 配置

- .eslintrc.json

  ```json
  {
    "env": {
      "vue/setup-compiler-macros": true
    }
  }
  ```

  配置这个来解决 `elsint` 检测 `defineProps` 报错
