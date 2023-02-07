"use strict";

global.isomorphic = true;
global.latestPRenewTime = new Date().getTime();
process.env.BABEL_DISABLE_CACHE = 1;
Error.stackTraceLimit = 200;

let proto = Object.getPrototypeOf(require);
!proto.hasOwnProperty("ensure") && Object.defineProperties(proto, {
	"ensure": {
		value: function ensure(modules, callback) {
			callback(this);
		},
		writable: false
	},
	"include": {
		value: function include() {},
		writable: false
	}
});

var interpolateName = require('loader-utils').interpolateName;

	require('css-modules-require-hook')({
		generateScopedName: function (name, filepath, css) {
			/**
			 *  console.log
			 *  { 
			 *  	resourcePath: '/Users/rexhome7326/Projects/plus_mweb_wap/node_modules/c_wap_module/lib/components/editor/style.css' 
			 *  } 
			 * 	'[path]uploading_[hash:base64:5]' 
			 * 	{ 
			 * 		content: 'node_modules/c_wap_module/lib/components/editor/style.css+uploading', 
			 * 		context: '/Users/rexhome7326/Projects/plus_mweb_wap' 
			 * 	}
			 */
			var newFilepath = filepath.replace(/.+node_modules/,"src");
					newFilepath = newFilepath.replace(/.+lib/,"src");
					
			var loaderContext = {resourcePath: newFilepath};
			var loaderOptions = {content: newFilepath+"+"+name };
			var genericName = interpolateName(loaderContext, name+'_[hash:base64:5]', loaderOptions);
		
			return genericName
			  .replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '-')
			  .replace(/^((-?[0-9])|--)/, "_$1");
	  }
	});

var path = require("path");
var dirPath = path.resolve(__dirname, path.relative(__dirname, ''));
var rootDir = '';

if(path.sep === "/"){
	rootDir = dirPath.replace(/(.+|)\//g,'');
}else{
	rootDir = dirPath.replace(new RegExp(".+\\"+path.sep),'');
}

if(process.env.NODE_PATH){
	process.env.NODE_PATH += ":"+dirPath;
}else{
	process.env.NODE_PATH = dirPath;
}

require('module').Module._initPaths();

var debug = require('debug')('express:server');
var http = require('http');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var parseUrl = require('parseurl');
var helmet = require('helmet');
var qs = require('qs');
var webpack = require("webpack");
var serverStatic = require("serve-static");
var favicon = require("serve-favicon");
var config = require('src/configs/config').default;
var routes = require('src/configs/routes').default;
var log4jsConfig = require("src/configs/log4js").default;
var createRouter = require('src/server/render/createRouter').default;
var serverRender = require('src/server/render').default;
var middlewares = require('src/server/middlewares');
var asyncBeApiConnectionPool = require('src/server/middlewares/asyncBeApi').setConnectionPool
var reactRoutes = require('src/client/routes').default;
var reducers = require('src/client/reducers').default;
var configureStore = require('src/client/store/ConfigureStore').default;
let app = express();

process.title = config.name;

if(process.env.NODE_ENV === "dev"){
	asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:10, maxFreeSockets: 10});
}else if(process.env.NODE_ENV === "lab"){
	asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20});
}else if(process.env.NODE_ENV === "staging"){
	asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20});
}else{
	asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:50, maxFreeSockets: 50});
}

app.disable('x-powered-by');

app.use( compression() );
app.use( cookieParser() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true}) );
app.use( function(req, res, next) {
	if (!req.query) {
		var parseResult = parseUrl(req).query;
		req.query = qs.parse(parseResult, {});
	}

	next();
});

if (process.env.NODE_ENV === 'dev') {
	app.use( favicon( path.resolve(__dirname, '../../public/favicon.ico') ) );
	app.use( serverStatic( path.resolve(__dirname, '../../public') ) );
}

app.use( middlewares.Log4jsMiddleware(log4jsConfig(config.name)) );
app.use( helmet() );

if(process.env.NODE_ENV === "dev"){
	var webpackDevConfig = require('src/configs/webpack.dev.config');
	var compiler = webpack(webpackDevConfig);
	app.use( middlewares.WebpackDevMiddleware(compiler, webpackDevConfig) );
	app.use( middlewares.WebpackHotMiddleware(compiler, webpackDevConfig) );
}

app.use( middlewares.LoginFilter() );
// app.use( middlewares.InitialUser() );

if(process.env.NODE_ENV === "dev"){
	app.use( middlewares.RemoteFetchMiddleware("ajax", config.params.remoteDataUrl, {}) );
}

app.use( middlewares.DeviceDetector() );
app.use( middlewares.I18nDetector() );

for(let url in routes){
  if(routes[url].hasOwnProperty("method")){
	  app[routes[url].method](url, createRouter(routes[url]) );
  }else{
	  app.use(url, createRouter(routes[url]));
  }
}

app.use( middlewares.HttpMethodFilter(['get','post']) );
app.use( serverRender(config.params.remoteDataUrl, reactRoutes, configureStore, reducers) );

if (process.env.NODE_ENV === 'dev') {
	app.use(middlewares.AjaxErrorHandler());
}

app.use( middlewares.ErrorHandler() );

app.use( function(error, req, res, next) {
	if(error.code){
		res.status(error.code).send(error.message||error.stack);
	}else{
		console.log(error);
		res.status(500).send(error.stack);
	}
});

var server = http.createServer(app).listen(config.port);
server.on('error', function onError(error){
	if (error.syscall !== 'listen') {
		throw error;
	}

	switch (error.code) {
		case 'EACCES':
			console.error('Port '+config.port+' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error('Port '+config.port+' is already in use');
			process.exit(1);
			break;
		default:
			console.log('Get error');
			console.log(error);
			throw error;
	}
});

server.on('listening', function onListening(){
	console.log("Server startup");
	console.log('Listening on port: ' + config.port);
});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});


module.exports = server;
