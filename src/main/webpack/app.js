'use strict'

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var os = require('os');

config.entry.unshift('webpack-dev-server/client?http://localhost:4072', "webpack/hot/dev-server");
config.plugins.push(new webpack.HotModuleReplacementPlugin());

var isDev = true

String.prototype.rewrite = function () {
    return this.replace("local_flag/", '')
        .replace("local_8080/", '')
        .replace("test_flag/", '')
        .replace("mc_proxy/", '')
        .replace("rc_proxy/", '')
        .replace("qc_proxy/", '')
}


var proxy = [
    {
        path: "/test_flag/rc_proxy/*",
        target: "http://10.0.8.54:8080/sales.engine.resource.api",
        rewrite: function (req) {
            req.url = req.url.rewrite();
        }
    }, {
        path: "/test_flag/mc_proxy/*",
        target: "http://10.0.8.175:8080/sales.engine.monitor.api",
        rewrite: function (req) {
            req.url = req.url.rewrite();
        }
    }, {
        path: "/test_flag/qc_proxy/*",
        target: "http://10.0.6.164:8080/sales.engine.qes.api",
        rewrite: function (req) {
            req.url = req.url.rewrite();
        }
    },{
        path: "/local_flag/rc_proxy/*",
        target: "http://localhost:8081",
        rewrite: function (req) {
            req.url = req.url.rewrite()
        }
    }, {
        path: "/local_8080/mc_proxy/*",
        target: "http://localhost:8080",
        rewrite: function (req) {
            req.url = req.url.rewrite()
        }
    },
    {
        path: "/local_8081/*",
        target: "http://localhost:8081",

        rewrite: function (req) {
            req.url = req.url.rewrite()
        }
    }
];


//启动服务
var app = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: isDev,
    historyApiFallback: isDev,
    proxy: proxy
});
app.listen(4072);