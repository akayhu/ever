// 20480 === 20K

const log = (name) => {
	const config = {
		"enabled" : true,
		"replaceConsole" : true,
		"showConsole" : true,
		"format" : ":method :url",
		"rules" : {
			"error" : {
				"maxLogSize" : 1048576,
				"backups" : 10
			},
			"warning" : {
				"maxLogSize" : 1048576,
				"backups" : 10
			},
			"normal" : {
				"maxLogSize" : 1048576,
				"backups" : 10
			}
		}
	};
	
	if(process.env.NODE_ENV !== "dev"){
		config.filepath = "/opt/node/logs";
		config.rules.normal.filename = "/opt/node/logs/"+name+".access.log";
		config.rules.warning.filename = "/opt/node/logs/"+name+".warning.log";
		config.rules.error.filename = "/opt/node/logs/"+name+".error.log";
	}
	
	return config;
};



export default log;