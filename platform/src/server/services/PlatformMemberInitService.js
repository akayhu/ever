"use strict";

import AsyncFetchHelper from 'async-fetch-helper';
import config from '../../configs/config';

class PlatformMemberInitService {
	static getInstance() {
		if(!this.platformMemberInitService){
			this.platformMemberInitService = new PlatformMemberInitService();
		}
		
		return this.platformMemberInitService;
	}
	
	constructor() {
		this.platformMemberInitService = null;
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
	}
	// 執行 plus 服務啟用程序 (plus 權限、小名片、新增 AC 啟用清單)
	// 若啟用流程失敗，不會更新 AC 啟用服務清單
	initUser(pid, callback) {
		this.asyncFetchHelper.need(['soap']).then((soap) => {
			return [
				soap('/PlatformAccountService.0.0', (client) => {
					client.initial({'pid' : pid});
				})
			];
		}).end((results) => {
			if(results[0].errorCode >= 400){
				results[0].isNewMember = true;
				results[0].isInit = false;
				callback(results[0]);
			}else{
				callback(results[0].response);
			}
		});
	}

	// 取得會員目前身份權限，藉此檢查是否曾走過初始化流程
	// 身份代碼清單: https://104plus.s3-ap-northeast-1.amazonaws.com/accountengine/apidoc/index.html#api-Membership_Timer-setMemberIdentity
	checkUserInfo(pid, callback) {
		let model = {
			isNewMember: false,
			isDelMember: false,
			success: false,
			error: '',
		};

		if(!pid) return callback({ ...model, error: '[checkUserIdentityCode] pid not found' });

		this.asyncFetchHelper.need(['soap']).then((soap) => {
			return [
				soap('/MembershipTimerService.0.0', (client) => {
					client.queryMembershipInfo({ 'pid': pid });
				})
			];
		}).end((results) => {
			const result = results[0];
			// 未初始化過的會員
			// https://104plus-dev.s3-ap-northeast-1.amazonaws.com/accountengine/apidoc/index.html#api-Membership_Timer-queryMembershipInfo
			if(result.response && result.response.warning){
				return callback({ ...model, success: true, isNewMember: true });
			}

			// 確認是否為已刪除會員
			if(result.response && result.response.identityCode) {
				return (result.response.identityCode == 501)
					? callback({ ...model, success: true, isDelMember: true }) // 已刪除會員
					: callback({ ...model, success: true }); // 已初始化會員，包含一般會員、違規會員
			}

			// 其他情況預設 error
			return callback(model);
		});
	}
}

export default PlatformMemberInitService;