
const isProduction = process.env.NODE_ENV === 'production'
const { resolve, join } = require('path')

const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tsx?/,
                use: ["babel-loader"],
                exclude: /node_modules/
            },

            {
                test: /\.css$/,
                use: ['css-loader']
            },
            { test: /\.less$/, use: ['css-loader', 'less-loader'] },
            { test: /\.(jpg|png|jpeg|gif)$/, use: ["file-loader"] }
        ]
    },
    watch: true,
    resolve: {
        alias: {
            '@': resolve('src'),
        },
        extensions: [".tsx", ".ts", ".js", ".json"]
    }


}
module.exports = webpackConfig