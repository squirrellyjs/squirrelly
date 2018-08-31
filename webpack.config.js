var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var webpack = require('webpack')

module.exports = env => {
    //console.log('Production: ', (env.production||"undefined")); // true
    //console.log('Target: ' + (env.target||"undefined"));

    var fileName;
    if (env && env.target && env.target === 'browser') {
        console.log("hey guys, this is ben")
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
            globalObject: "typeof self !== 'undefined' ? self : this",
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true
                })
            ]
        },
        mode: (env && env.production) ? 'production' : 'development',
        plugins: [
            new webpack.DefinePlugin({
                RUNTIME: ((env && env.target === 'browser')) ? JSON.stringify(true) : JSON.stringify(false),
                PRODUCTION: (env && env.production) ? true : false
            })
        ]
    }
}