"use strict";

global.isomorphic = false;
process.env.BABEL_DISABLE_CACHE = 1;
Error.stackTraceLimit = 200;

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
var AsyncFetchHelper = require('async-fetch-helper');
var config = require('src/configs/config').default;
var routes = require('src/configs/routes').default;
var ErrorHandler = require('src/server/middlewares/ErrorHandler').default;
var ErrorHandlerGetErrorCount = require('src/server/middlewares/ErrorHandler').getErrorCount;
var LoginFilter = require('src/server/middlewares/LoginFilter').default;
var ApiCheckRefer = require('src/server/middlewares/apiCheckRefer').default;
var ErrorMessageUtil = c_platform.server.utils.ErrorMessageUtil;
let app = express();

process.title = config.name;

app.disable('x-powered-by');
app.set('trust proxy', 'loopback');
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

if(process.env.NODE_ENV === "dev"){
	AsyncFetchHelper.setConnectionPool({
		rest: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:10, maxFreeSockets: 10},
		soap: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:10, maxFreeSockets: 10}
	});
	
	app.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
		next();
	});
}else if(process.env.NODE_ENV === "lab"){
	AsyncFetchHelper.setConnectionPool({
		rest: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20},
		soap: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20}
	});
	
	app.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
		// res.removeHeader('X-Frame-Options');
		next();
	});
}else if(process.env.NODE_ENV === "staging"){
	AsyncFetchHelper.setConnectionPool({
		rest: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20},
		soap: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:20, maxFreeSockets: 20}
	});
}else{
	AsyncFetchHelper.setConnectionPool({
		rest: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:100, maxFreeSockets: 100},
		soap: { keepAlive: true, keepAliveMsecs: 600000 , maxSockets:100, maxFreeSockets: 100}
	});
}

app.use( c_platform.server.middlewares.Log4jsMiddleware(c_platform.server.configs.log4js(config.name)) );
app.use( helmet() );
app.use( LoginFilter() );
app.use( ApiCheckRefer());

for(let url in routes){
	if(routes[url].hasOwnProperty("method")){
  	app[routes[url].method](url, c_platform.server.render.createRouter(routes[url]) );
  }else{
  	app.use(url, c_platform.server.render.createRouter(routes[url]));
  }
}

if(process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "lab"){
	app.get("/ajax/getCS", (req, res, next) => {
		res.type('js').send('window.CS = "'+req.cookies.CS+'";' || "");
	});
}

app.get("/ajax/monitor/sigt", (req, res, next) => {
	var errorCount = ErrorHandlerGetErrorCount();
	
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
app.use( ErrorHandler() );
app.use( ErrorHandler(404) );

var server;
if(process.env.NODE_ENV !== 'test') {
	server = http.createServer(app).listen(config.port);

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

	process.on('uncaughtException', (error) => {
		ErrorMessageUtil(error, null);
	});	
}

exports.app = app;
exports.expressApp = app;
exports.server = server;
