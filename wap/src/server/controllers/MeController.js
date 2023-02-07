"use strict";

export const actionView = (req, res, next) => {
	const userModel = req.userModel;
	const pid = userModel.pid;
	const isLogin =  userModel.isLogin || false;
	
	if (isLogin) {
	  return res.redirect("/profile/"+pid);
	} else {
	  return res.redirect("/sso/saml-login?r=/me");
	}
};