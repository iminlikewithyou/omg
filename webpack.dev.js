const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const LiveReloadPlugin = require("webpack-livereload-plugin");
const OpenBrowserPlugin = require("open-browser-plugin");
const path = require('path');

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new LiveReloadPlugin({
        port: 9000,
        appendScriptTag: true
    }),
    new OpenBrowserPlugin({
      port: 8080
    })
  ]
});