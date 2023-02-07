"use strict";

var path = require("path");
const webpack = require('webpack');
var HappyPack = require('happypack');
var ExtracTextPlugin = require('extract-text-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var rootPath = path.resolve(__dirname, path.relative(__dirname,''));
var interpolateName = require('loader-utils').interpolateName;
var config = {
	name: 'c_platform'
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
		modules: [ rootPath, "node_modules" ],
		extensions: [".js", ".jsx"]
	},
	output: {
		path: path.join(rootPath, '/public/build/c_platform'),
		publicPath: '',
		filename: '[name].js',
		libraryTarget: 'var',
		library: 'c_platform',
	},
	plugins: [
		//new BundleAnalyzerPlugin(),
		new webpack.DllReferencePlugin({
			context: rootPath,
			manifest: require(path.join(rootPath, 'public/build/manifest.json'))
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify("production"),
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
					use: [{
						loader: 'css-loader',
						options: {
							modules: true,
							importLoaders: 1,
							localIdentName: '[local]_[hash:base64:5]',
							getLocalIdent: function(content, localIdentName, localName, options){
								/**
								 * console.log
								 * /Users/rexhome7326/Projects/plus_mweb_wap/src/client/components/activity/module/stream.css
								 * [local]_[hash:base64:5]
								 * bottom
								 * { regExp: undefined, hashPrefix: '', context: undefined }
								 */
								var newFilepath = content.resourcePath.replace(/.+node_modules/,"src");
										newFilepath = newFilepath.replace(/.+src/,"src");
								// console.log(newFilepath);
								var loaderContext = {resourcePath: newFilepath};
								var loaderOptions = { content: newFilepath+"+"+localName };
						    var genericName = interpolateName(loaderContext, localName+'_[hash:base64:5]', loaderOptions);

						    return genericName
						      .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
						      .replace(/^((-?[0-9])|--)/, "_$1");
							}
						}
					}],
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