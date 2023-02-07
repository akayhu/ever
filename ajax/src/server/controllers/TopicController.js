"use strict";

import SubscribeFunctionService from 'src/server/services/SubscribeFunctionService';
import FunctionStatisticService from 'src/server/services/FunctionStatisticService';

const subscribeFunctionService = SubscribeFunctionService.getInstance();
const functionStatisticService = FunctionStatisticService.getInstance();

export const actionGetSubscribeList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
	subscribeFunctionService.getSubscribeList(pid, (result) => {
		res.json(result);
	});
};

export const actionSubscribe = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	subscribeFunctionService.subscribe(pid, paramMap.func, paramMap.weights, (result) => {
		res.json(result);
	});
};

export const actionUnsubscribe = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	subscribeFunctionService.unsubscribe(pid, paramMap.func, (result) => {
		res.json(result);
	});
};

export const actionGetEndorseList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
  const { func } = paramMap;

	functionStatisticService.getEndorseList(func, (result) => {
		res.json(result);
	});
};

export const actionGetEndorsePeopleList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func, item, limit, offset } = paramMap;

	functionStatisticService.getEndorsePeopleList(pid, func, item, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionInitEndorseSection = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func, item, limit, offset } = paramMap;
	functionStatisticService.initEndorseSection(pid, func, (result) => {
		res.json(result);
	});
};

export const actionGetFollowedList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func, limit, offset } = paramMap;

	functionStatisticService.getFollowedList(pid, func, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetWorkspaceListHot = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { productKey, funcName, topic, offset, limit, activityTag } = paramMap;

	functionStatisticService.getWorkspaceListHot(productKey, pid, funcName, topic, offset, limit, activityTag, (result) => {
		res.json(result);
	});
};

export const actionGetGalleryList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func, limit, offset } = paramMap;

	functionStatisticService.getGalleryList(pid, func, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetGroupList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func, limit, offset } = paramMap;

	functionStatisticService.getGroupList(pid, func, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionInitGroupSection = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func } = paramMap;

	functionStatisticService.initGroupSection(pid, func, (result) => {
		res.json(result);
	});
};

export const actionGetHonorList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func, limit, offset } = paramMap;

	functionStatisticService.getHonorList(pid, func, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionInitHonorSection = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func } = paramMap;

	functionStatisticService.initHonorSection(pid, func, (result) => {
		res.json(result);
	});
};

export const actionGetMediaList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func, limit, offset } = paramMap;

	functionStatisticService.getMediaList(pid, func, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionInitMediaSection = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func } = paramMap;

	functionStatisticService.initMediaSection(pid, func, (result) => {
		res.json(result);
	});
};

export const actionGetRelatedFunction = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func } = paramMap;

	functionStatisticService.getRelatedFunction(pid, func, (result) => {
		res.json(result);
	});
};

export const actionInitRelatedSection = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { func } = paramMap;

	functionStatisticService.initRelatedSection(pid, func, (result) => {
		res.json(result);
	});
};