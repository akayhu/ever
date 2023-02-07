"use strict";

import BcCommunicationService from 'src/server/services/BcCommunicationService';
const bcCommunicationService = BcCommunicationService.getInstance();

export const actionGetMsgList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.getMsgList(pid, paramMap.pageNo, paramMap.pageRow, (result) => {
		res.json(result);
	});
};

export const actionSetContactInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.setContactInfo(pid, paramMap.cellphone, paramMap.custNo, paramMap.isAgree, paramMap.jobNo, (result) => {
		res.json(result);
	});
};

export const actionGetMsgDetail = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.getMsgDetail(pid, paramMap.jobNo, paramMap.updateRead, paramMap.pageNo, paramMap.pageRow, paramMap.asc, (result) => {
		res.json(result);
	});
};

export const actionGetUnreadMsgCnt = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.getUnreadMsgCnt(pid, (result) => {
		res.json(result);
	});
};

export const actionSendMsg = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.sendMsg(
		pid, 
		paramMap.custNo, 
		paramMap.custName, 
		paramMap.jobNo, 
		paramMap.jobName, 
		paramMap.profileStatus, 
		paramMap.status, 
		paramMap.content, 
		paramMap.attachment, 
		paramMap.attachmentId, (result) => {
		res.json(result);
	});
};

export const actionGetContactInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.getContactInfo(pid, paramMap.custNo, (result) => {
		res.json(result);
	});
};

export const actionQueryPidStatus = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.queryPidStatus(pid, paramMap.custNo, (result) => {
		res.json(result);
	});
};

export const actionBaseConvert = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.baseConvert(paramMap.jobNo, (result) => {
		res.json(result);
	});
};

export const actionGetAttachFile = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.getAttachFile(pid, paramMap.custNo, paramMap.msgId, paramMap.attachNum, (result) => {
		
		if( result.response ){
			const data = result.response.content;
			const raw = new Buffer(data, 'base64');
			res.writeHead(200, {
				'Content-Type':'application/force-download;charset=UTF-8',
				'Content-Disposition': 'attachment; filename="'+ encodeURI(result.response.fileName) + '"'
			});

			res.end(raw);
		}else {
			res.json(result);
		}
	});
};

export const actionUploadNewBCAttach = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	
	bcCommunicationService.uploadNewBCAttach(pid, paramMap.json_string, (result) => {
		res.json(result);
	});
};

export const actionGetCompanyLogo = (req, res, next) => {
	const paramMap = req.paramMap;

	bcCommunicationService.getCompanyLogo(paramMap.custNo, (result) => {
		res.json(result);
	})
}