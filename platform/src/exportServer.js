"use strict";

var c_platform = { commons:{}, controllers: {}, middlewares:{}, render:{}, configs:{}, utils:{} }
// var BaseControllerPath = "./server/commons/BaseController";
var SamlControllerPath = "./server/controllers/SamlController";
var FbControllerPath = "./server/controllers/FbController";
var asyncBeApiPath = "./server/middlewares/asyncBeApi";
var RemoteFetchMiddlewarePath = "./server/middlewares/RemoteFetchMiddleware";
var DeviceDetectorPath = "./server/middlewares/DeviceDetector";
var HttpMethodFilterPath = "./server/middlewares/HttpMethodFilter";
var I18nDetectorPath = "./server/middlewares/I18nDetector";
var WebpackDevMiddlewarePath = "./server/middlewares/WebpackDevMiddleware";
var WebpackHotMiddlewarePath = "./server/middlewares/WebpackHotMiddleware";
var LoginFilterPath = "./server/middlewares/LoginFilter";
var InitialUser = "./server/middlewares/initialUser";
var Log4jsMiddlewarePath = "./server/middlewares/Log4jsMiddleware";
var ErrorHandlerPath = "./server/middlewares/ErrorHandler";
var AjaxErrorHandlerPath = "./server/middlewares/AjaxErrorHandler";
var ErrorMessageUtilPath = "./util/ErrorMessageUtil";
var createRouterPath = "./server/render/createRouter";
var serverRenderPath = "./server/render";
var samlUrlPath = "./configs/routes";
var samlUrlConfig = require(samlUrlPath).default;
var log4jsPath = "./configs/log4js";
var generalConfigPath = "./configs/generalConfig";

delete samlUrlConfig["/"];
delete samlUrlConfig["/ajax"];
delete samlUrlConfig["/error"];

for(var route in samlUrlConfig){
	samlUrlConfig[route].from = "c_platform.server.controllers";
}

// c_platform.commons.BaseController = require(BaseControllerPath).default;
c_platform.controllers.SamlController = require(SamlControllerPath).default;
c_platform.controllers.FbController = require(FbControllerPath).default;
c_platform.middlewares.asyncBeApi = require(asyncBeApiPath).default;
c_platform.middlewares.asyncBeApiConnectionPool = require(asyncBeApiPath).setConnectionPool;
c_platform.middlewares.RemoteFetchMiddleware = require(RemoteFetchMiddlewarePath).default;
c_platform.middlewares.DeviceDetector = require(DeviceDetectorPath).default;
c_platform.middlewares.HttpMethodFilter = require(HttpMethodFilterPath).default;
c_platform.middlewares.I18nDetector = require(I18nDetectorPath).default;

if (global && global.isomorphic === true) {
	c_platform.middlewares.WebpackDevMiddleware = require(WebpackDevMiddlewarePath).default;
	c_platform.middlewares.WebpackHotMiddleware = require(WebpackHotMiddlewarePath).default;
}

c_platform.middlewares.LoginFilter = require(LoginFilterPath).default;
c_platform.middlewares.InitialUser = require(InitialUser).default;
c_platform.middlewares.Log4jsMiddleware = require(Log4jsMiddlewarePath).default;
c_platform.middlewares.ErrorHandlerGetErrorCount = require(ErrorHandlerPath).getErrorCount;
c_platform.middlewares.ErrorHandler = require(ErrorHandlerPath).default;
c_platform.middlewares.AjaxErrorHandler = require(AjaxErrorHandlerPath).default;
c_platform.render.createRouter = require(createRouterPath).default;

if (global && global.isomorphic === true) {
	c_platform.render.serverRender = require(serverRenderPath).default;
}

c_platform.configs.routes = samlUrlConfig;
c_platform.configs.log4js = require(log4jsPath).default;
c_platform.configs.generalConfig = require(generalConfigPath);

c_platform.utils.ErrorMessageUtil = require(ErrorMessageUtilPath).default;

module.exports = c_platform;