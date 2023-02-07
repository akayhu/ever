'use strict';

var webpack = require('webpack');
const HappyPack = require('happypack');
var path = require('path');
var ExtracTextPlugin = require('extract-text-webpack-plugin'); 
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var request = require('sync-request');
var res = request('GET', 'http://172.19.1.116/bigc/c_platform/build/manifest.json'); //static.s104.com.tw
var manifest = JSON.parse(res.getBody('utf8'));
var rootPath = path.resolve(__dirname, path.relative(__dirname, ''));
var config = {
	name: 'c_wap'
};

module.exports = {
	context: rootPath,
	devtool: 'source-map',
	entry: {
		client: [
			'src/export.js'
		]
	},
	resolve: {
		modules: [rootPath, 'node_modules'],
		extensions: ['.js', '.jsx']
	},
	output: {
		path: path.join(rootPath, '/public/build/c_wap'),
		publicPath: '',
		filename: '[name].js',
		libraryTarget: 'var',
		library: 'c_wap'
	},
	externals: {
		'c_platform': 'window.c_platform'
	},
	plugins: [ 
		//new BundleAnalyzerPlugin(),
		new webpack.DllReferencePlugin({
			context: rootPath,
			manifest: manifest//require(path.join(rootPath, "public/build/manifest.json")) //
		}), 
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				updateDateTime: (new Date().getTime())
			},
			"global": {
				isomorphic: JSON.stringify(true)
			}
		}), 
		new HappyPack({
			cache: true,
			loaders: [
				{
					path: 'babel-loader',
					query: {
						cacheDirectory: false
					}
				}
			],
			threads: 8
		}), 
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.LoaderOptionsPlugin({
			debug: false,
			minimize: true
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			output: {
				comments: false
			},
			compress: {
				warnings: false
			},
			exclude: [/\.min\.js$/gi]
		}), 
		new ExtracTextPlugin({
			filename: 'client.css',
			disable: false,
			allChunks: true
		})
	],
	module: {
		exprContextRegExp: /$^/,
		exprContextCritical: false,
		rules: [
			{
				test: /\.js$/,
				use: 'happypack/loader',
				exclude: /node_modules/,
				include: rootPath
			}, 
			{
				test: /\.css$/,
				use: ExtracTextPlugin.extract({
					fallback: 'style-loader',
					use: 'css-loader?modules&importLoaders=1&localIdentName=[path][name]_[local]'
				}),
				include: rootPath
			}, 
			{
				test: /\.(png|jpg|gif|svg|ttf|woff)$/,
				use: 'file-loader'
			}
		]
	}
};