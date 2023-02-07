"use strict";

import path from "path";
import log4js from "log4js";

const basePath = path.resolve(__dirname, path.relative(__dirname, ''));
const setting = { appenders: [] };
const appenders = [];

function createAppenders(config) {
	for(var levelName in config.rules){
		let levelSetting = config.rules[levelName];
		
		levelSetting.type = levelSetting.type || "file",
		levelSetting.category = levelName;
		
		if(levelSetting.hasOwnProperty("filename")){
			if( !/\//.test(levelSetting.filename) ){
				if(config.hasOwnProperty("filepath")) {
					levelSetting.filename = path.join(config.filepath, levelSetting.filename);
				}else{
					levelSetting.filename = path.join(basePath+"/runtime", levelSetting.filename);
				}
			}
		}else{
			if(config.hasOwnProperty("filepath")){
				levelSetting.filename = path.join(config.filepath, levelName+".log");
			}else{
				levelSetting.filename = path.join(basePath+"/runtime", levelName+".log");
			}
		}
		
		appenders.push(levelSetting);
	}
}

function prepare(config){
	if(config.enabled === true){
		const finialConfig = {
			level: 'auto'
		};
		
		if(config.hasOwnProperty("replaceConsole") && config.replaceConsole === true){
			setting.replaceConsole = config.replaceConsole;
		}

		if(config.hasOwnProperty("showConsole") && config.showConsole === true){
			setting.appenders.push({"type" : "console"});
		}

		if(config.hasOwnProperty("format")){
			setting.format = config.format;
			finialConfig.format = setting.format;
		}

		if(config.rules !== null) {
			createAppenders(config);
		}

		setting.appenders = setting.appenders.concat(appenders);
		log4js.configure(setting);
		
		const logger = log4js.getLogger('normal');
		logger.setLevel('INFO');
		
		return log4js.connectLogger(logger, finialConfig);
	}
	
	return null;
}

const Log4jsMiddleware = (config) => {
	let log = null;
	
	if(config.enabled === true){
		log = prepare(config);
	}
	
	return (req, res, next) => {
		if(log && process.env.NODE_ENV === "dev"){
			log(req, res, next);
		}else{
			next();
		}
	};
};

export default Log4jsMiddleware;