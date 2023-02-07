"use strict";

import ChannelService from 'src/server/services/ChannelService';

const channelService = ChannelService.getInstance();

export const actionGetMediaList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { limit, offset } = paramMap;

	channelService.getMediaList(pid, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetSubscribeMediaList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { limit, offset } = paramMap;

	channelService.getSubscribeMediaList(pid, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionSubscribeMedia = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	channelService.subscribeMedia(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionUnsubscribeMedia = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	channelService.unsubscribeMedia(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionGetMediaListByNewActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { day, limit, offset } = paramMap;

	channelService.getMediaListByNewActivity(pid, day, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionAddMediaRole = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, targetPid, role } = paramMap;

	channelService.addMediaRole(pid, channelId, targetPid, role, (result) => {
		res.json(result);
	});
};

export const actionDeleteMediaRole = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, targetPid } = paramMap;

	channelService.deleteMediaRole(pid, channelId, targetPid, (result) => {
		res.json(result);
	});
};

export const actionGetMediaInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	channelService.getMediaInfo(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionGetMediaMemberList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, limit, offset } = paramMap;

	channelService.getMediaMemberList(pid, channelId, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetMediaRoleList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, limit, offset } = paramMap;

	channelService.getMediaRoleList(pid, channelId, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionUpdateMedia = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, coverFid, coverPicDrag, avatarFileId, avatarCoordinate, description } = paramMap;

	channelService.updateMedia(pid, channelId, coverFid, coverPicDrag, avatarFileId, avatarCoordinate, description, (result) => {
		res.json(result);
	});
};

export const actionInviteSubscribeMedia = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { targetPid, channelId } = paramMap;

	channelService.inviteSubscribeMedia(pid, targetPid, channelId, (result) => {
		res.json(result);
	});
};

export const actionSearchMediaMember = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, name, limit, offset } = paramMap;

	channelService.searchMediaMember(pid, channelId, name, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetChannIdByNameUrl= (req, res, next) => {
	const paramMap = req.paramMap;
  const { name } = paramMap;

	channelService.getChannIdByNameUrl(name, (result) => {
		res.json(result);
	});
};