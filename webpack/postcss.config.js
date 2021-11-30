const autoprefixer= require('autoprefixer')
const stylelint = require('stylelint')
const postcssCssnext = require('postcss-cssnext')
module.exports = {
  plugins: [
    stylelint({
      config: {
        rules: {
          'declaration-no-important': true
        }
      }
    }),
    postcssCssnext({
      browsers: [
        '> 1%',
        'last 2 versions',
      ]
    }),

    autoprefixer({
      grid: true,
      browsers: [
        '> 1%',
        'last 3 versions',
        'android 4.2',
        'ie 8'
      ]
    })
  ]
}