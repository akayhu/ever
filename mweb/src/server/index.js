'use strict';

global.isomorphic = true;
global.latestPRenewTime = new Date().getTime();
process.env.BABEL_DISABLE_CACHE = 1;
Error.stackTraceLimit = 200;

var proto = Object.getPrototypeOf(require);
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

if (process.env.NODE_ENV === 'dev') {
	require('css-modules-require-hook')({
		generateScopedName: '[path][local]_[hash:base64:5]'
	});
}else{
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
}

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
var c_platform = require('c_platform');
var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var parseUrl = require('parseurl');
var helmet = require('helmet');
var qs = require('qs');
var webpack = require('webpack');
var helmet = require('helmet');
var serverStatic = require('serve-static');
var favicon = require('serve-favicon');
var config = require('src/configs/config').default;
var routes = require('src/configs/routes').default;
var reactRoutes = require('src/client/routes').default;
var reducers = require('src/client/reducers').default;
var configureStore = require('src/client/store/ConfigureStore').default;
var ErrorMessageUtil = c_platform.server.utils.ErrorMessageUtil;
let app = express();

process.title = config.name;

var excludeList = [
	'/m/mobile/api/', '/m/common/img/', '/m/templates/', '/m/p/group/redirect/'
];

if(process.env.NODE_ENV === "dev"){
	c_platform.server.middlewares.asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:10, maxFreeSockets: 10});
}else if(process.env.NODE_ENV === "lab"){
	c_platform.server.middlewares.asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20});
}else if(process.env.NODE_ENV === "staging"){
	c_platform.server.middlewares.asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20});
}else{
	c_platform.server.middlewares.asyncBeApiConnectionPool({ keepAlive: true, keepAliveMsecs: 600000 , maxSockets:50, maxFreeSockets: 50});
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
	app.use(favicon(path.resolve(__dirname, '../../public/favicon.ico')));
	app.use(serverStatic(path.resolve(__dirname, '../../public')))
}else{
	app.use((req, res, next) => {
		var checkIsExclude = false;
		var originalUrl = decodeURIComponent(req.originalUrl);
		
		if(originalUrl){
			excludeList.map((excludeItem) => {
				var re = new RegExp(excludeItem, "i");

				if(re.test(originalUrl)){
					checkIsExclude = true;
				}
			});
			
			if(checkIsExclude === true){
				return res.status(404).send("Not Found");
			}else{
				return next();
			}
		}else{
			return next();
		}
	});
}

app.use(c_platform.server.middlewares.Log4jsMiddleware(c_platform.server.configs.log4js(config.name)));
app.use(helmet({
	force: true
}));

if (process.env.NODE_ENV === 'dev') {
	var webpackDevConfig = require('src/configs/webpack.dev.config');
	var compiler = webpack(webpackDevConfig);
	app.use(c_platform.server.middlewares.WebpackDevMiddleware(compiler, webpackDevConfig));
	app.use(c_platform.server.middlewares.WebpackHotMiddleware(compiler, webpackDevConfig))
}

app.use(c_platform.server.middlewares.LoginFilter());
app.use(c_platform.server.middlewares.InitialUser());

if (process.env.NODE_ENV === 'dev') {
	app.use(c_platform.server.middlewares.RemoteFetchMiddleware("ajax", config.params.remoteDataUrl, {}))
}

app.use(c_platform.server.middlewares.DeviceDetector());
app.use(c_platform.server.middlewares.I18nDetector());

for (var url in routes) {
	if (routes[url].hasOwnProperty('method')) {
		app[routes[url].method](url, c_platform.server.render.createRouter(routes[url]))
	} else {
		app.use(url, c_platform.server.render.createRouter(routes[url]))
	}
}

app.get('/m/monitor/sigt', function(req, res, next) {
	var errorCount = c_platform.server.middlewares.ErrorHandlerGetErrorCount();
	
	if(errorCount > 100){
		res.status(500).send("Server has died");
	}else{
		var He = 'He';
		var llo = 'llo';
		res.status(200).send(He + llo);
	}
});

app.get("/favicon.ico", (req, res, next) => {
	res.sendStatus(200);
});

app.use(c_platform.server.middlewares.HttpMethodFilter(['get','post']));
app.use(c_platform.server.render.serverRender(config.params.remoteDataUrl, reactRoutes, configureStore, reducers));

if (process.env.NODE_ENV === 'dev') {
	app.use(c_platform.server.middlewares.AjaxErrorHandler());
}

app.use(c_platform.server.middlewares.ErrorHandler("/m", {
	401: function(error, req, res, next){
		return res.redirect('/m');
	}
}));

app.use( function(error, req, res, next) {
	if(error.code){
		res.status(error.code).send(error.message||error.stack);
	}else{
		console.log(error);
		res.status(500).send(error.stack);
	}
});

var server = http.createServer(app).listen(config.port);

if(process.env.NODE_ENV !== 'dev'){
	try{
		require('lib/client/containers/mIndex/index');
		require('lib/client/containers/mActivity/index');
		require('lib/client/containers/mBeagiver/index');
		require('lib/client/containers/mBeagiver/resumeclinic');
		require('lib/client/containers/mBeagiver/live');
		require('lib/client/containers/mBeagiver/story');
		require('lib/client/containers/mChannel/index');
		require('lib/client/containers/mError/index');
		require('lib/client/containers/mGroupList/index');
		require('lib/client/containers/mMyGroups/index');
		require('lib/client/containers/mGroup/index');
		require('lib/client/containers/mNotification/index');
		require('lib/client/containers/mProfile/index');
		require('lib/client/containers/mMyCollect/index');
		require('lib/client/containers/mSearch/index');
		require('lib/client/containers/mTopic/index');
	}catch(e){
		console.log(e);
	}
}

server.on('error', function onError(error) {
	if (error.syscall !== 'listen') {
		throw error
	}
	switch (error.code) {
		case 'EACCES':
			console.error('Port ' + config.port + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error('Port ' + config.port + ' is already in use');
			process.exit(1);
			break;
		default:
			console.log('Get error');
			console.log(error);
			throw error;
	}
});

server.on('listening', function onListening() {
	console.log('Server startup');
	console.log('Listening on port: ' + config.port)
});

process.on('uncaughtException', (error) => {
  ErrorMessageUtil(error, null);
});

module.exports = server;
