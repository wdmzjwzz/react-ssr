const path = require("path");
const nodeExternals = require("webpack-node-externals");
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
module.exports = merge(baseConfig, {
  mode: "development",
  target: "node",
  entry: path.join(__dirname, "../src/server/app.tsx"),
  output: {
    filename: "app.js",
    path: path.join(__dirname, "../dist"),
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
});
