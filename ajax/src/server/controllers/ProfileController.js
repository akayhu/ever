"use strict";

import ProfileService from 'src/server/services/ProfileService';
import AESService from 'src/server/services/AESService';
import MembershipService from 'src/server/services/MembershipService';

const profileService = ProfileService.getInstance();
const aesService = AESService.getInstance();
const membershipService = MembershipService.getInstance();

export const actionLoginUser = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	
	if(!paramMap.pid){
		paramMap.pid = userModel.pid;
	}
	
	profileService.getLoginUser(userModel.pid, paramMap.pid, (result) => {	
		if(Object.keys(result).length > 0){
			aesService.encrypt(userModel.pid, (aesServiceRes) => {
				if(aesServiceRes.response) result.response.aesPid = aesServiceRes.response.encrypted;
				res.json(result);
			})
		}else{
			result = userModel;
			res.json(result);
		}
	});
};

export const actionDetail = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	
	profileService.getProfile(userModel.pid, paramMap.pid, (result) => {
		res.json(result);
	});


	// membershipService.isWatchProfile({ pid: userModel.pid, targetPid: paramMap.pid}, (result) => {
	// 	console.log(result);
	// 	if( result.response && !result.response.hasOwnProperty('warning') ) {
	// 		profileService.getProfile(userModel.pid, paramMap.pid, (result) => {
	// 			res.json(result);
	// 		});
	// 	}else {
	// 		res.json({
	// 			errorCode: 403,
	// 			errorMsg: '不允許存取此人 Profile 或 此ID不存在'
	// 		})
	// 	}
	// });

	
};;

export const actionGetWrapProfileInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;

	profileService.getWrapProfileInfo(userModel.pid, paramMap.pid, (result) => {
		res.json(result);
	});
};

export const actionUpdateAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileService.updateAvatar(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionAdjustAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileService.adjustAvatar(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionDeleteAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileService.deleteAvatar(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionUpdateCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileService.updateCover(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionAdjustCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileService.adjustCover(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionDeleteCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	profileService.deleteCover(pid, paramMap, (result) => {
		res.json(result);
	});
};