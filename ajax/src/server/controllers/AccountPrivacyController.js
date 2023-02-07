"use strict";

import AccountPrivacyService from 'src/server/services/AccountPrivacyService';
import MembershipService from 'src/server/services/MembershipService';

const accountPrivacyService = AccountPrivacyService.getInstance();
const membershipServiceInstance = MembershipService.getInstance();

export const actionSetMemberIdentity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	membershipServiceInstance.setMemberIdentity(paramMap, (result) => {
    res.json(result);
  });
}

export const actionGetMemberIdentityList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	membershipServiceInstance.getMemberIdentityList(paramMap, (result) => {
		res.json(result);
	});
}

export const actionIsAllowReadProfile = (req, res, next) => {
	const paramMap = req.paramMap;
	
	delete paramMap.pid;
	
	membershipServiceInstance.isAllowReadProfile(paramMap, (result) => {
		res.json(result);
	});
}

export const actionIsWatchProfile = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;
	
	membershipServiceInstance.isAllowReadProfile(paramMap, (result) => {
		res.json(result);
	});
}

export const actionQueryPrivacyByPids = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accountPrivacyService.queryPrivacyByPids(paramMap, (result) => {
		res.json(result);
	});
}

export const actionQueryPrivacyInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = paramMap.pid || userModel.pid;

	accountPrivacyService.queryPrivacyInfo(paramMap, (result) => {
		res.json(result);
	});
}

export const actionQuerySinglePrivacy = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accountPrivacyService.querySinglePrivacy(paramMap, (result) => {
		res.json(result);
	});
}

export const actionUpdatePrivacy = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accountPrivacyService.updatePrivacy(paramMap, (result) => {
		res.json(result);
	});
}

export const actionUpdateSinglePrivacy = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	paramMap.pid = userModel.pid;

	accountPrivacyService.updateSinglePrivacy(paramMap, (result) => {
		res.json(result);
	});
}