"use strict";

const HttpMethodFilter = (defMethod) => (req, res, next) => {
	var _defMethod = defMethod.join("|");
	
	const reg = new RegExp(_defMethod, 'i');
	
	if(req.ignore === true && reg.test(req.method)) {
		next();
	} else if(!req.ignore && reg.test(req.method)) {
		next();
	} else {
		next({
			code: 405,
			message: 'Method Not Allowed',
			stack: {}
		});
	}
	
	return;
};

export default HttpMethodFilter;