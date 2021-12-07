const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

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
  configureWebpack: (config) => {
    // 代码 gzip
    const productionGzipExtensions = ['html', 'js', 'css']
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件
      }),
    )

    // 不打包moment的语言包
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

    // 去除console
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': 'skyblue',
            // 'link-color': '#1DA57A',
            // 'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
      sass: {
        prependData: "@import '@/themes/index.scss';",
      },
    },
  },
  devServer: {
    open: true,
    port: 8888,
    proxy: {
      '/api': {
        // target: `https://39.106.167.191:18081`,
        target: `http://127.0.0.1:18081`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      'socket.io': {
        // target: `https://39.106.167.191:18081`,
        target: `http://127.0.0.1:18081`,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  productionSourceMap: false,
}
