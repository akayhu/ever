"use strict";

import GroupService from 'src/server/services/GroupService';

const groupService = GroupService.getInstance();

export const actionQueryGroupListByCategory = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { category, limit, offset } = paramMap;

	groupService.queryGroupListByCategory(pid, category, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionApplyGroup = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, name, description, category, type, tags, func, joinSetting } = paramMap;

	groupService.applyGroup(pid, channelId, name, description, category, type, tags, func, joinSetting, (result) => {
		res.json(result);
	});
};

export const actionQueryGroupCategoryList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	groupService.queryGroupCategoryList(pid, (result) => {
		res.json(result);
	});
};

export const actionQueryWrapGroupCategoryList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	groupService.queryWrapGroupCategoryList(pid, (result) => {
		res.json(result);
	});
};

export const actionQueryGroupListByCreator = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { limit, offset } = paramMap;

	groupService.queryGroupListByCreator(pid, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionQueryRecommendGroupList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { limit, offset, func } = paramMap;

	groupService.queryRecommendGroupList(pid, func, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetGroupInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	groupService.getGroupInfo(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionQueryGroupListByManaged = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { limit, offset } = paramMap;

	groupService.queryGroupListByManaged(pid, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionQueryJoinedGroupList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { targetPid, limit, offset } = paramMap;
	const passwayPid =  (targetPid === undefined) ? pid : targetPid;

	groupService.queryJoinedGroupList(passwayPid, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionQueryWaitForJoinGroupList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { limit, offset } = paramMap;

	groupService.queryWaitForJoinGroupList(pid, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionQueryManageGroupListByStatus = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { status, limit, offset } = paramMap;

	groupService.queryManageGroupListByStatus(pid, status, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetMyGroupInitData = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	groupService.getMyGroupInitData(pid, (result) => {
		res.json(result);
	});
};

export const actionApplyJoinGroup = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	groupService.applyJoinGroup(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionCancelApplyJoin = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	groupService.cancelApplyJoin(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionSetGroupHead = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { targetPid, channelId } = paramMap;

	groupService.setGroupHead(pid, targetPid, channelId, (result) => {
		res.json(result);
	});
};

export const actionUpdateGroup = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, description, tags, joinSetting, fid, picDrag } = paramMap;

	groupService.updateGroup(pid, channelId, description, tags, joinSetting, fid, picDrag, (result) => {
		res.json(result);
	});
};

export const actionDeleteApplyGroup = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	groupService.deleteApplyGroup(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionQueryGroupListByNewActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { day, limit, offset } = paramMap;

	groupService.queryGroupListByNewActivity(pid, day, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionInviteFriend = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { targetPid, channelId } = paramMap;

	groupService.inviteFriend(pid, targetPid, channelId, (result) => {
		res.json(result);
	});
};

export const actionSetGroupAdmin = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { targetPid, channelId, isAdmin } = paramMap;

	groupService.setGroupAdmin(pid, targetPid, channelId, isAdmin, (result) => {
		res.json(result);
	});
};

export const actionVerifyGroupMember = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { targetPids, channelId, isPass } = paramMap;

	groupService.verifyGroupMember(pid, targetPids, channelId, isPass, (result) => {
		res.json(result);
	});
};

export const actionLeaveGroup = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId } = paramMap;

	groupService.leaveGroup(pid, channelId, (result) => {
		res.json(result);
	});
};

export const actionDeleteGroupMember = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { targetPid, channelId } = paramMap;

	groupService.deleteGroupMember(pid, targetPid, channelId, (result) => {
		res.json(result);
	});
};

export const actionQueryGroupMemberList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, limit, offset } = paramMap;

	groupService.queryGroupMemberList(pid, channelId, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionQueryGroupAdminList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, limit, offset } = paramMap;

	groupService.queryGroupAdminList(pid, channelId, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionQueryApplyList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, limit, offset } = paramMap;

	groupService.queryApplyList(pid, channelId, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionGetActivityListByChannel = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, sortField, offset, limit, order, activityTag } = paramMap;

	groupService.getActivityListByChannel(pid, channelId, sortField, offset, limit, order, activityTag, (result) => {
		res.json(result);
	});
};

export const actionBatchRemoveChannelActivity = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, aidList } = paramMap;

	groupService.batchRemoveChannelActivity(pid, channelId, aidList, (result) => {
		res.json(result);
	});
};

export const actionSearchGroupMember = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;
  const { channelId, name, limit, offset } = paramMap;

	groupService.searchGroupMember(pid, channelId, name, limit, offset, (result) => {
		res.json(result);
	});
};

export const actionSetNoticeStatus = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	groupService.setNoticeStatus(pid, paramMap.targetId, paramMap.status, paramMap.type, function handleSetNoticeStatus(result){
		res.json(result);
	});
};

export const actionQueryMyGroupList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	groupService.queryMyGroupList(pid, paramMap, (result) => {
		res.json(result);
	});
};
