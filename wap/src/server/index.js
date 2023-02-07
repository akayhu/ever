'use strict';

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
	'/apple-touch-icon.png', '/apple-touch-icon-precomposed.png', '/ill_logo_104.gif', '/104beagiver/heartfelt', 
	'/apple-app-site-association', '/file.docapi.104.com.tw/', '/common/css/', '/common/img/', '/common/js/', 
	'/p/group/redirect/', '/templates/', '/giver/api/', '/mobile/api/', '/templets/', '/activity/m/', '/library/', '/images/avatar/'
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
	app.use(serverStatic(path.resolve(__dirname, '../../public')));
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

app.get('/monitor/sigt', function(req, res, next) {
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

app.get('/:name', function(req, res, next) {

	var actionProfile = require('src/server/controllers/RoutesController').actionProfile;
	var pattern =/^[\u0391-\uFFE5A-Za-z0-9]+$/;
	var clientRouteCheckList = [
		'm','p','build','initial', 'privacy', 'newsletter', 'activity', 'notification', 'message', 'topic', 'error', 'mts', 'search', 'profile', 'group', 'channel', 'test', '104beagiver', 'apple-touch-icon-precomposed.png', 'apple-touch-icon.png', 'privacyCheck', 'prelogin', 'opensearch'
	];

	if(clientRouteCheckList.indexOf(req.params.name) < 0 ) {
		c_platform.server.render.createRouter({
			method: "get",
			handler: actionProfile
		})(req, res, next);

	}else return next();

})

app.use(c_platform.server.render.serverRender(config.params.remoteDataUrl, reactRoutes, configureStore, reducers));

if (process.env.NODE_ENV === 'dev') {
	app.use(c_platform.server.middlewares.AjaxErrorHandler());
}

app.use(c_platform.server.middlewares.ErrorHandler());

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
		require('lib/client/containers/index/index');
		require('lib/client/containers/beagiver/index');
		require('lib/client/containers/beagiver/resumeclinic');
		require('lib/client/containers/beagiver/live');
		require('lib/client/containers/beagiver/story');
		require('lib/client/containers/channel/channelList');
		require('lib/client/containers/channel/channelMain');
		require('lib/client/component_channel/channel/channelManagement');
		require('lib/client/component_channel/channel/channelMember');
		require('lib/client/containers/group/groupList');
		require('lib/client/containers/group/groupApplyform');
		require('lib/client/containers/group/groupMain');
		require('lib/client/component_group/group/groupManagement');
		require('lib/client/component_group/group/groupMember');
		require('lib/client/containers/profile/index');
		require('lib/client/containers/profile/main');
		require('lib/client/component_activities/personalList');
		require('lib/client/component_connection/index');
		require('lib/client/containers/search/index');
		require('lib/client/containers/search/searchActivityList/index');
		require('lib/client/containers/search/searchChannelList/index');
		require('lib/client/containers/search/searchGroupList/index');
		require('lib/client/containers/search/searchActivityList/index');
		require('lib/client/containers/search/searchPersonList/index');
		require('lib/client/containers/test/index');
		require('lib/client/containers/test/industry');
		require('lib/client/containers/test/job');
		require('lib/client/containers/test/organization');
		require('lib/client/containers/activity/singlePage');
		require('lib/client/containers/error/index');
		require('lib/client/containers/initial/index');
		require('lib/client/containers/mail/index');
		require('lib/client/containers/message/cc/index');
		require('lib/client/containers/message/bc/index');
		require('lib/client/containers/index/done');
		require('lib/client/containers/newsletter/index');
		require('lib/client/containers/notification/index');
		require('lib/client/containers/privacy/index');
		require('lib/client/containers/topic/index');
		require('lib/client/containers/topic/articleList');
		require('lib/client/containers/topic/staffList');
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
