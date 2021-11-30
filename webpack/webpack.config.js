const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const DashBoardPlugin = require('webpack-dashboard/plugin')
module.exports = {
  mode: "development",
  devtool:"source-map",
  entry: {
    app: './src/a.js',
  },
  output: {
    filename: "[name].js"
  },
  plugins: [
    new DashBoardPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require(path.join(__dirname, 'dll/manifest.json'))
    }),
  ]
}