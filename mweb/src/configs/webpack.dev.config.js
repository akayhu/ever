"use strict";

var path = require("path");
var webpack = require("webpack");
var HappyPack = require("happypack");
var request = require('sync-request');
var res = request('GET', 'http://static.104-dev.com.tw/bigc/c_platform/build/manifest.json');//172.19.1.116
var manifest = JSON.parse(res.getBody('utf8'));
var rootPath = path.resolve(__dirname, path.relative(__dirname, ""));
var srcPath = path.resolve(rootPath, 'src');
var config = {
	name: "plus_mweb_wap"
};

var settings = {
	context: rootPath,
	devtool: false,
	entry: {
		bundle: [
			"webpack-hot-middleware/client",
			"src/client/index.js"
		],
		en: ["src/client/locales/en/en.js"],
		zhTW: ["src/client/locales/zhTW/zhTW.js"]
	},
	resolve: {
		modules: [rootPath, "node_modules"],
		extensions: [".js", ".jsx"]
	},
	output: {
		path: path.join(rootPath, "/public/build/"),
		publicPath: "/build/",
		filename: config.name + "_[name].js",
		sourceMapFilename: config.name + '_[name].map',
		libraryTarget: "var",
		library: config.name + "_[name]",
		chunkFilename: "[name].chunk.js"
	},
	externals: {
		"c_platform":"window.c_platform",
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify('development')
			}
		}),
		new HappyPack({
			cache: true,
			loaders: [{
				path: "babel-loader",
				query: {
					cacheDirectory: false,
					plugins: [
						[
					    'react-transform', {
					      transforms: [{
					        transform : 'react-transform-hmr',
					        imports   : ['react'],
					        locals    : ['module']
					      }]
					    }
					  ]
					]
				}
			}],
			threads: 8
		}),
		new webpack.NoEmitOnErrorsPlugin,
		new webpack.LoaderOptionsPlugin({
			debug: true,
		}),
		new webpack.DllReferencePlugin({
			context: rootPath,
			manifest: manifest
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	module: {
		exprContextRegExp: /$^/,
		exprContextCritical: false,
		rules: [
		{
			test: /\.js$/,
			loader: "happypack/loader",
			include: srcPath
		},
		{
			test: /\.css$/,
			loader: [
				"style-loader",
				{
					loader: 'css-loader',
					options: {
						modules: true,
						importLoaders: 1,
						localIdentName: '[path][local]_[hash:base64:5]',
					}
				},
				"postcss-loader"
			],
			include: rootPath
		},
		{
			test: /\.(png|jpg|gif|svg)$/,
			loader: "file-loader"
		},
		{
			test: /\.json$/,
			loader: "json-loader"
		}]
	},
	devServer: {
    proxy: {
      '/ajax/*': {
        target: 'http://pluslocal.104-dev.com.tw:3002'
      }
    }
  }
};

if(global.isomorphic === true){
	delete settings.devServer;
}

module.exports = settings;

