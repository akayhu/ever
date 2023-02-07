"use strict";

var path = require("path");
var webpack = require("webpack");
var HappyPack = require('happypack');
var rootPath = path.resolve(__dirname, path.relative(__dirname,''));
var config = {
	name: 'c_platform'
};

var settings = {
	context: rootPath,
	devtool: false,
	entry: {
		bundle: [
			'webpack-hot-middleware/client',
			'src/client/index.js'
		],
		en: ['src/client/locales/en/en.js'],
		zhTW: ['src/client/locales/zhTW/zhTW.js']
	},			
	resolve: {
		modules: [ rootPath, "node_modules" ],
		extensions: [".js", ".jsx"]
	},
	output: {
		path: path.join(rootPath, '/public/build/'),
		publicPath: '/build',
		filename: config.name + '_[name].js',
		sourceMapFilename: config.name + '_[name].map',
		libraryTarget: 'var',
		library: config.name + '_[name]',
		chunkFilename: "[name].chunk.js"
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify("development")
			}
		}),
		new HappyPack({
			cache: true,
			loaders: [
				{
					path: 'babel-loader',
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
				}
			],
			threads: 8
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.LoaderOptionsPlugin({
			debug: false
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
	module: {
		exprContextRegExp: /$^/,
		exprContextCritical: false,
		rules: [
			{
				test: /\.js$/,
				loader: 'happypack/loader',
				exclude: /node_modules/,
				include: rootPath
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
				loader: 'file-loader'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
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
