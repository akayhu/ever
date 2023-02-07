"use strict";

import ConnectionService from 'src/server/services/ConnectionService';

const connectionService = ConnectionService.getInstance();

export const actionGetConnectionStatus = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getConnectionStatus(pid, paramMap.targetPid, function handleGetConnectionStatus(result){
		res.json(result);
	});
};

export const actionGetFriendList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getFriendList(pid, paramMap.targetPid, paramMap.limit, paramMap.offset, function handleGetFriendList(result){
		res.json(result);
	});
};

export const actionGetAllFriendList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getAllFriendList(pid, function handleGetFriendList(result){
		res.json(result);
	});
};

export const actionGetInviteList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getInviteList(pid, paramMap.connectionStatus, paramMap.limit, paramMap.offset, function handleGetInviteList(result){
		res.json(result);
	});
};

export const actionGetFollowList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getFollowList(pid, paramMap.targetPid, paramMap.direction, paramMap.limit, paramMap.offset, function handleGetFollowList(result){
		res.json(result);
	});
};

export const actionGetMutualFriendList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getMutualFriendList(pid, paramMap.targetPid, paramMap.limit, paramMap.offset, function handleGetMutualFriendList(result){
		res.json(result);
	});
};

export const actionGetMayKnowPeopleList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getMayKnowPeopleList(pid, paramMap.limit, paramMap.offset, function handleGetMayKnowPeopleList(result){
		res.json(result);
	});
};

export const actionGetExcellentPeopleList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getExcellentPeopleList(pid, paramMap.mediaLimit, paramMap.mediaOffset, paramMap.peopleLimit, paramMap.peopleOffset, function handleGetExcellentPeopleList(result){
		res.json(result);
	});
};

export const actionGetRejectList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getRejectList(pid, function handleGetRejectList(result){
		res.json(result);
	});
};

export const actionGetExcludeList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getExcludeList(pid, function handleGetExcludeList(result){
		res.json(result);
	});
};

export const actionGetBlockList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getBlockList(pid, paramMap.limit, paramMap.offset, function handleGetBlockList(result){
		res.json(result);
	});
};

export const actionGetNamecardConnectionInfo = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getNamecardConnectionInfo(pid, paramMap.targetPid, function handleGetNamecardConnectionInfo(result){
		res.json(result);
	});
};

export const actionSearchFriend = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.searchFriend(pid, paramMap.keyword, function handleSearchFriend(result){
		res.json(result);
	});
};

export const actionGetGroupItemList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getGroupItemList(pid, function handleGetGroupItemList(result){
		res.json(result);
	});
};

export const actionGetGroupMemberList = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.getGroupMemberList(pid, paramMap.groupId, paramMap.limit, paramMap.offset, function handleGetGroupMemberList(result){
		res.json(result);
	});
};

export const actionInvite = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.invite(pid, paramMap.targetPid, paramMap.relationType, paramMap.memo, function handleInvite(result){
		res.json(result);
	});
};

export const actionAccept = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.accept(pid, paramMap.targetPid, function handleAccept(result){
		res.json(result);
	});
};

export const actionReject = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.reject(pid, paramMap.targetPid, function handleReject(result){
		res.json(result);
	});
};

export const actionRevoke = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.revoke(pid, paramMap.targetPid, function handleRevoke(result){
		res.json(result);
	});
};

export const actionDisconnect = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.disconnect(pid, paramMap.targetPid, function handleDisconnect(result){
		res.json(result);
	});
};

export const actionSubscribe = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.subscribe(pid, paramMap.targetPid, function handleSubscribe(result){
		res.json(result);
	});
};

export const actionUnsubscribe = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.unsubscribe(pid, paramMap.targetPid, function handleUnsubscribe(result){
		res.json(result);
	});
};

export const actionNotice = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.notice(pid, paramMap.targetPid, paramMap.status, function handleUnsubscribe(result){
		res.json(result);
	});
};


export const actionExclude = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.exclude(pid, paramMap.targetPid, paramMap.status, function handleExclude(result){
		res.json(result);
	});
};

export const actionBlock = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.block(pid, paramMap.targetPid, paramMap.blockStatus, function handleBlock(result){
		res.json(result);
	});
};

export const actionJoin = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.join(pid, paramMap.targetPid, paramMap.groupId, function handleJoin(result){
		res.json(result);
	});
};

export const actionCreateGroup = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.createGroup(pid, paramMap.groupName, function handleCreateGroup(result){
		res.json(result);
	});
};

export const actionUpdateGroupName = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.updateGroupName(pid, paramMap.groupId, paramMap.groupName, function handleUpdateGroupName(result){
		res.json(result);
	});
};

export const actionDeleteGroup = (req, res, next) => {
	const paramMap = req.paramMap;
	const userModel = req.userModel;
	const pid = userModel.pid;

	connectionService.deleteGroup(pid, paramMap.groupId, function handleDeleteGroup(result){
		res.json(result);
	});
};