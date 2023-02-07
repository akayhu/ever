"use strict";

import ActivityService from 'src/server/services/ActivityService';
import ActivityEndorseService from 'src/server/services/ActivityEndorseService';
import ActivityInteractiveService from 'src/server/services/ActivityInteractiveService';

const activityService = ActivityService.getInstance();
const activityEndorseService = ActivityEndorseService.getInstance();
const activityInteractiveService = ActivityInteractiveService.getInstance();

export const actionAddEndorse = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityEndorseService.addEndorse(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionAddEndorseList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityEndorseService.addEndorseList(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionCollect = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.interactiveCollect(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionCreate = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.createActivity(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionCreateComment = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.createComment(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionDelete = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.deleteActivity(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionDelEndorseItems = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityEndorseService.delEndorseItems(pid, paramMap, (result) => {
		res.json(result);
	});
}


export const actionDelEndorser = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityEndorseService.delEndorser(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getActivity(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetActivityCountByPids = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getActivityCountByPids(paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetActivityListByChannel = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getActivityListByChannel(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetAllEndorse = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityEndorseService.getAllEndorse(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetCommentList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getCommentList(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetCollectList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getCollectList(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetMyCollectCount = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getMyCollectCount(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetPersonalWall = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getPersonalWall(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetPersonalRiver = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getPersonalRiver(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetPersonalRiverHot = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getPersonalRiverHot(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetPersonalRiverNew = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getPersonalRiverNew(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetPersonalRiverAll = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getPersonalRiverAll(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionGetRelatedActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.getRelatedActivity(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionIgnore = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.interactiveIgnore(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionLike = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.interactiveLike(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionNotInterested = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.notInterested(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionRemovecollect = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	activityInteractiveService.interactiveRemoveCollect(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionSubscribe = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.subscribe(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionSuggestEndorse = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityEndorseService.suggestEndorseByContent(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionUnlike = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.interactiveUnlike(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionUpdate = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityService.updateActivity(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionUndoNotInterested = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.undoNotInterested(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionUnsubscribe = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.unsubscribe(pid, paramMap, (result) => {
		res.json(result);
	});
}

export const actionViewActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	activityInteractiveService.viewActivity(pid, paramMap, (result) => {
		res.json(result);
	});
}