### 快速原型开发

可以使用 `vue serve` 和 `vue build` 命令对单个 `*.vue` 文件进行快速原型开发，不过这需要先额外安装一个全局的扩展：

```bash
yarn global add @vue/cli-service-global
# 安装运行静态资源服务
yarn global add serve
# 指定运行目录 或者 进入运行根目录运行
serve -s dist
```

### `Nginx` 配置  `history` 模式规则

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### `js-cookie`

- 设置

### `v-viewer`

用于图片浏览的Vue组件，支持旋转、缩放、翻转等操作，基于[viewer.js](https://github.com/fengyuanchen/viewerjs)。



### `ant-design-vue`

### `moment`

[moment官网](https://momentjs.com/) 格式化时间插件 支持多国语言

`vuex-class`
