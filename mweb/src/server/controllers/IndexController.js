"use strict";

export const actionIndex = (req, res, next) => {
	if(req.userModel.isLogin === false){
		req.layout = "WelcomeLayout";
	}
	
  next();
};

export const actionBackToPc = (req, res, next) => {
	const paramMap = req.query;
	let returnRef = paramMap.r || req.headers.referer;
	
	if(returnRef){
		returnRef = returnRef.replace(/.+\/m\//,"/");
	}else{
		returnRef = "/";
	}
	
	
	if(/myGroup/g.test(returnRef)){
		returnRef = '/group'
	}
	
	res.cookie('majorPc', "true", { maxAge: 900000, httpOnly: true, path: "/" });
	res.redirect(returnRef);
};

export const actionAjax = (req, res, next) => {
  res.json(req.remoteData);
};

export const actionWelcome = (req, res, next) => {
  res.redirect("/m");
};

export const actionProfileSub = (req, res, next) => {
  if(req.userModel.isLogin === true && req.query && req.query.mode==='collect'){
  	res.redirect("/m/myCollect");
  }else{
  	res.redirect("/m/profile/"+req.params.pid);
  }
};

export const actionInit = (req, res, next) => {
  res.redirect("/m");
};