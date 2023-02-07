"use strict";

import DocumentService from 'src/server/services/DocumentService';

const documentServiceInstance = DocumentService.getInstance();

export const actionGetEncryParam = (req, res, next) => {
	const paramMap = req.paramMap;
	// const userModel = req.userModel;
	// const pid = userModel.pid;

	documentServiceInstance.getEncryParam(paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureProfileAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureAvatar(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureProfileCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureCover(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureGroupAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureAvatar(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureGroupCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureCover(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureImage = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureImage(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureDocument = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureDocument(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureVideo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureVideo(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetSignatureAudio = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getSignatureAudio(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionReConvertProfileAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getFileDetail(pid, paramMap, (getFileDetailResult) => {
		paramMap.filename = getFileDetailResult.filename;
		documentServiceInstance.reConvertAvatar(pid, paramMap, (result) => {
			res.json(result);
		});
	});;
};

export const actionReConvertProfileCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getFileDetail(pid, paramMap, (getFileDetailResult) => {
		paramMap.filename = getFileDetailResult.filename;
		documentServiceInstance.reConvertCover(pid, paramMap, (result) => {
			res.json(result);
		});
	});;
};

export const actionReConvertGroupAvatar = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getFileDetail(pid, paramMap, (getFileDetailResult) => {
		paramMap.filename = getFileDetailResult.filename;
		documentServiceInstance.reConvertAvatar(pid, paramMap, (result) => {
			res.json(result);
		});
	});;
};

export const actionReConvertGroupCover = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getFileDetail(pid, paramMap, (getFileDetailResult) => {
		paramMap.filename = getFileDetailResult.filename;
		documentServiceInstance.reConvertCover(pid, paramMap, (result) => {
			res.json(result);
		});
	});;
};

export const actionGetFileDetail = (req, res, next) =>{
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.getFileDetail(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionHtmlConvert = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	documentServiceInstance.htmlConvert(pid, paramMap, (result) => {
		res.json(result);
	});
};

export const actionGetFileUrl = (req, res, next) => {
	const paramMap = req.paramMap;
	documentServiceInstance.getFileUrl(paramMap, (result) => {
		res.json(result);
	});
};

export const actionDiscardFile = (req, res, next) => {
	const paramMap = req.paramMap;
	documentServiceInstance.discardFile(paramMap, (result) => {
		res.json(result);
	});
};
