### 个人学习内容

- ads
  - 广告链接
- daily
  - 日常记录点
- electron
  - electron 相关项目
- es6相关
  - es6 语法

- nestjs
  - nest.js 服务端项目
- njs
  - 用 JavaScript 写 nginx
- npm
  - 个人写 npm 包
- python
  - python启动本地服务

- rollup
  - rollup 打包

- vite
  - vite构建

- vue
  - vue 相关
- vue3
  - vue3 学习

- wasm
  - wasm 相关
- webgl
  - webgl 相关
- webpack
  - webpack 相关
- word
  - 不会单词
- 总结
  - 常用方法
  - 优化js代码
  - 删除 github 的 commit 记录


### node-sass的坑

- node-sass编译不过去
  - `yarn config set registry https://registry.npm.taobao.org -g`
- 设置 node-sass 二进制包下载地址
  - `yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g`

### Webstorm 配置 webpack

 ```js
 // webstorm 配置webpack
'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.scss'],
    alias: {
      '@': resolve('src'),
      // '@views': resolve('src/views'),
      // '@comp': resolve('src/components'),
      // '@core': resolve('src/core'),
      // '@utils': resolve('src/utils')
    }
  },
}
 ```

### 修改 Element-ui 的边框选择颜色

```css
.el-slider__bar {
  background-color: #39c19a;
}

.el-slider__button {
  border: 2px solid #39c19a;
}

.el-select-dropdown__item.selected {
  color: #39c19a;
}

.el-select .el-input__inner:focus {
  border-color: #39c19a;
}

.el-select .el-input.is-focus .el-input__inner{
  border-color: #39c19a;
}

.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #39c19a;
}
```
