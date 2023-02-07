var webpack = require('webpack');
var HappyPack = require('happypack');
var ExtracTextPlugin = require('extract-text-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var path = require("path");
var fs = require("fs");
var rootPath = path.resolve(__dirname, path.relative(__dirname,''));
var interpolateName = require('loader-utils').interpolateName;

// function getFileList(src) {
// 	var list = [];

// 	src = path.join(rootPath, "node_modules", src);

// 	try {
// 		list = fs.readdirSync(src, "utf8").filter(function(item){
// 			return /\.js$/.test(item);
// 		}).map(function(item){
// 			return path.join(src, item);
// 		});
// 	}catch(e){
// 		console.log(e);
// 	}
// 	return list;
// }

const vendors = [
	'babel-polyfill',
	'strip-ansi',
	'ansi-regex',
	'ansi-html',
	'html-entities',
	'deep-assign',
	'is-obj',
	'i18next',
	'bluebird',
	'redux',
	'redux-logger',
	'redux-thunk',
	'react-redux',
	'react-dom',
	'react-i18next',
	'react-router',
	'react-ga',
	'react-draggable',
	'react-cropper',
	'react-addons-css-transition-group',
	'react-addons-pure-render-mixin',
	'react-addons-update',
	'react-addons-perf',
	'react-css-modules',
	'recompose',
	'reselect',
	'cookies',
	'dompurify',
	'superagent',
	'validator'
];

module.exports = {
	devtool: 'source-map',
	entry: {
		"lib": vendors,
	},
	performance: {
    maxAssetSize: 10000,
    maxEntrypointSize: 10000,
    hints: 'warning',
  },
	output: {
		path: path.join(rootPath, '/public/build/'),
		publicPath: '/build/',
		filename: '[name].js',
		sourceMapFilename: '[name].map',
		libraryTarget: 'var',
		library: '[name]',
	},
	plugins: [
		// new BundleAnalyzerPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DllPlugin({
			path: path.join(rootPath, '/public/build/manifest.json'),
			name: '[name]',
			context: rootPath,
		}),
		new webpack.LoaderOptionsPlugin({
			debug: false,
			minimize: true
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			},
			output: {
				comments: false
			},
			exclude: [/\.min\.js$/gi]
		}),
		new ExtracTextPlugin({
			filename: 'lib.css',
			disable: false,
			allChunks: true
		})
	],
	module: {
		exprContextRegExp: /$^/,
    exprContextCritical: false,
		rules: [
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
				test: /\.(png|svg|ttf|woff)$/,
				loader: 'file-loader'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	},
};
