const path = require('path')
const JavaScriptObfuscator = require('webpack-obfuscator')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool:"source-map",
  entry: {
    app: './src/a.js',
    // lib: ['lib-a', 'lib-b', 'lib-c']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './assets/'
  },
  module: {
    rules: [
      {
        test:  /\.js$/,
        use: {
          loader: 'force-strict-loader',
          options: {
            sourceMap: true
          }
        }
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     ExtractTextPlugin.extract({
      //       fallback: 'style-loader',
      //       use: 'css-loader'
      //     })
      //   ]
      // },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:6]'
            }
          }
        ]
      }
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         // css-loader 配置项
      //       }
      //     }
      //   ],
      //   exclude: /node_modules/,
      //   // exclude: /node_modules\/(?!(foo|bar)\/).*/,
      //   // include: /node_modules\/awesome-ui/
      // },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       cacheDirectory: true,
      //       presets: [
      //         ['@babel/preset-env', {modules: false}]
      //       ]
      //     }
      //   }
      // },
      // {
      //   test: /\.ts$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "ts-loader",
      //   }
      // },
      // {
      //   test: /\.html$/,
      //   use: [
      //     'html-loader',
      //   ],
      // },
      // {
      //   test: /\.handlebars$/,
      //   use: [
      //     'handlebars-loader',
      //   ],
      // },
      // // {
      // //   test: /\.(png|jpg|gif)$/,
      // //   use: {
      // //     loader: 'file-loader',
      // //     options: {
      // //       name: '[name].[ext]',
      // //       publicPath: './another-path/'
      // //     }
      // //   }
      // // },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   use: {
      //     loader: 'url-loader',
      //     options: {
      //       limit: 10240,
      //       name: '[name].[ext]',
      //       outputPath: 'image',
      //       publicPath: './image/'
      //     }
      //   }
      // },
      // {
      //   test: /\.vue$/,
      //   loader: 'vue-loader',
      // }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new ExtractTextPlugin('bundle.css'),
    new JavaScriptObfuscator({
      // 压缩代码
      compact: true,
      // 是否启用控制流扁平化(降低1.5倍的运行速度)
      controlFlowFlattening: true,
      // 应用概率;在较大的代码库中，建议降低此值，因为大量的控制流转换可能会增加代码的大小并降低代码的速度。
      controlFlowFlatteningThreshold: 1,
      // 随机的死代码块(增加了混淆代码的大小)
      deadCodeInjection: false,
      // 死代码块的影响概率
      deadCodeInjectionThreshold: 1,
      // 此选项几乎不可能使用开发者工具的控制台选项卡
      debugProtection: false,
      // 如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
      debugProtectionInterval: false,
      // 通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
      disableConsoleOutput: false,
      // 标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      // 是否启用全局变量和函数名称的混淆
      renameGlobals: true,
      // 通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
      rotateStringArray: true,
      // 混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
      selfDefending: true,
      // 删除字符串文字并将它们放在一个特殊的数组中
      stringArray: true,
      stringArrayThreshold: 1,
      // 允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
      transformObjectKeys: true,
      unicodeEscapeSequence: true
      // 数组内是需要排除的文件
    }, ['excluded_bundle_name.js'])
  ],
  devServer: {
    open: true,
    publicPath: './dist'
  }
}
