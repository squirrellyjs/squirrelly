var path = require('path')
var webpack = require('webpack')

module.exports = env => {
  // console.log('Production: ', (env.production||"undefined")); // true
  // console.log('Target: ' + (env.target||"undefined"));

  var fileName
  var target = 'node'
  if (env && env.target && env.target === 'browser') {
    target = 'web'
    console.log('Compiling')
    if (env.production) {
      fileName = 'squirrelly.runtime.js'
    } else {
      fileName = 'squirrelly.runtime.dev.js'
    }
  } else {
    if (env && env.production) {
      fileName = 'squirrelly.min.js'
    } else {
      fileName = 'squirrelly.dev.js'
    }
  }
  return {
    entry: './src/index.js',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: fileName,
      library: 'Sqrl',
      libraryTarget: 'umd',
      globalObject: "typeof self !== 'undefined' ? self : this"
    },
    devServer: {
      contentBase: path.join(__dirname, '')
    },
    node: {
      fs: 'empty'
    },
    target: target,
    devtool: 'sourcemap',
    externals: {
      fs: 'commonjs fs'
    },
    mode: (env && env.production) ? 'production' : 'development',
    plugins: [
      new webpack.DefinePlugin({
        RUNTIME: ((env && env.target === 'browser')) ? JSON.stringify(true) : JSON.stringify(false),
        PRODUCTION: !!((env && env.production))
      })
    ]
  }
}
