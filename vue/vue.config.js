module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 10240 }))

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.plugin('html').tap((args) => {
        args[0].title = '小超人聊天室'
        return args // [/* 传递给 html-webpack-plugin's 构造函数的新参数 */]
      })
    } else {
      // 为开发环境修改配置...
      config.plugin('html').tap((args) => {
        args[0].title = '小超人聊天室'
        args[0].bodyName = 'xcr-Body'
        return args // [/* 传递给 html-webpack-plugin's 构造函数的新参数 */]
      })
    }
  },
  devServer: {
    open: true,
    port: 8888,
    proxy: {
      '/api': {
        target: `https://39.106.167.191:18081`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      'socket.io': {
        target: `https://39.106.167.191:18081`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  productionSourceMap: false,
}
