"use strict";

export const actionAjax = (req, res, next) => {
	//res.json({"errorCode":500,"errorMsg":"Server Error","errorStack":{}});
	res.json(req.remoteData);
};