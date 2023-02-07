import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

const TypeOf = (obj) => Object.prototype.toString.call(obj).match(/\s(\w+)]/)[1]

const serverName = '/GroupService.0.0';
const productKey = config.params.apnum;

class GroupService {

	static getInstance() {
		if(!this.groupService){
			this.groupService = new this;
		}

		return this.groupService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.groupService = null;
	}

	queryGroupListByCategory(pid, category, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'queryGroupListByCategory',
      {pid, category, limit, offset},
      callback
    )
	}

  applyGroup(pid, channelId, name, description, category, type, tags, func, joinSetting, callback) {
    doAsyncFetch.call(this,
      serverName,
      'applyGroup',
      {pid, channelId, name, description, category, type, tags, func, joinSetting},
      callback
    )
	}

	queryGroupCategoryList(pid, callback) {
	    doAsyncFetch.call(this, serverName, 'queryGroupCategoryList', {}, callback)
	}

	queryWrapGroupCategoryList(pid, callback) {
	    this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/GroupService.0.0', (client) => {
					client.queryGroupCategoryList({'pid':pid});
				}),
				soap('/GroupService.0.0', (client) => {
					client.queryJoinedGroupList({'pid':pid, 'targetPid':pid, 'limit': 10, 'offset': 0});
				}),
				soap('/GroupService.0.0', (client) => {
					client.queryManageGroupListByStatus({'pid':pid, 'targetPid':pid, 'status':1, 'limit': 10, 'offset': 0});
				})
			];
		}).end(function(results){
			let res = {"response":{}};
			res.response.categoryList = results[0].response;
			res.response.joinedCount = (results[1].response !== undefined && typeof results[1].response.total !== 'undefined') ? results[1].response.total : 0;
			res.response.manageCount = (results[2].response !== undefined && typeof results[2].response.total !== 'undefined') ? results[2].response.total : 0;
			if(callback){
				callback(res);
			}
		});
	}

  queryGroupListByCreator(pid, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'queryGroupListByCreator',
      {pid, limit, offset},
      callback
    )
	}

  getGroupInfo(pid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getGroupInfo',
      {pid, channelId},
      callback
    )
	}

  queryRecommendGroupList(pid, func, limit, offset, callback) {
    doAsyncFetch.call(this,
      '/FunctionStatisticService.0.0',
      'getGroupList',
      {pid, func, limit, offset},
      callback
    )
  }

  queryGroupListByManaged(pid, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'queryGroupListByManaged',
      {pid, limit, offset},
      callback
    )
  }

  queryJoinedGroupList(pid, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'queryJoinedGroupList',
      {pid, limit, offset},
      callback
    )
  }

	queryWaitForJoinGroupList(pid, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'queryWaitForJoinGroupList',
      {pid, limit, offset},
      callback
    )
  }

	queryManageGroupListByStatus(pid, status, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'queryManageGroupListByStatus',
      {pid, status, limit, offset},
      callback
    )
  }

	getMyGroupInitData(pid, callback) {
		const limit = 1, offset = 0;
		doAsyncFetch.call(this,
      serverName,
      [
				{name: 'joined', action: 'queryJoinedGroupList', params: {pid, limit, offset}},
				{name: 'waitForJoin', action: 'queryWaitForJoinGroupList', params: {pid, limit, offset}},
				{name: 'checking', action: 'queryManageGroupListByStatus', params: {pid, status: 0, limit, offset}},
				{name: 'managed', action: 'queryManageGroupListByStatus', params: {pid, status: [1, 3], limit, offset}},
				{name: 'rejected', action: 'queryManageGroupListByStatus', params: {pid, status: 2, limit, offset}},
			],
			{},
      callback
    )
	}

	applyJoinGroup(pid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'applyJoinGroup',
      {pid, channelId},
      callback
    )
  }

	cancelApplyJoin(pid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'cancelApplyJoin',
      {pid, channelId},
      callback
    )
  }

	setGroupHead(pid, targetPid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'setGroupHead',
      {pid, targetPid, channelId},
      callback
    )
  }

	updateGroup(pid, channelId, description, tags, joinSetting, fid, picDrag, callback) {
    doAsyncFetch.call(this,
      serverName,
      'updateGroup',
      {pid, channelId, description, tags, joinSetting, fid, picDrag},
      callback
    )
  }

	deleteApplyGroup(pid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'deleteApplyGroup',
      {pid, channelId},
      callback
    )
  }

	queryGroupListByNewActivity(pid, day, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'queryGroupListByNewActivity',
      {pid, day, limit, offset},
      callback
    )
  }

	inviteFriend(pid, targetPid, channelId, callback) {
		doAsyncFetch.call(this,
			serverName,
			'inviteFriend',
			{pid, targetPid, channelId},
			callback
		)
	}

	setGroupAdmin(pid, targetPid, channelId, isAdmin, callback) {
		doAsyncFetch.call(this,
			serverName,
			'setGroupAdmin',
			{pid, targetPid, channelId, isAdmin},
			callback
		)
	}

	verifyGroupMember(pid, targetPids, channelId, isPass, callback) {
		doAsyncFetch.call(this,
			serverName,
			'verifyGroupMember',
			{pid, targetPids, channelId, isPass},
			callback
		)
	}

	leaveGroup(pid, channelId, callback) {
		doAsyncFetch.call(this,
			serverName,
			'leaveGroup',
			{pid, channelId},
			callback
		)
	}

	deleteGroupMember(pid, targetPid, channelId, callback) {
		doAsyncFetch.call(this,
			serverName,
			'deleteGroupMember',
			{pid, targetPid, channelId},
			callback
		)
	}

	setNoticeStatus(pid, targetId, status, type, callback) {
		doAsyncFetch.call(this,
			'/SubscribeService.0.0',
			'setNoticeStatus',
			{productKey, pid, targetId, status, type},
			callback
		)
	}

	queryGroupMemberList(pid, channelId, limit, offset, callback) {
		doAsyncFetch.call(this,
			serverName,
			'queryGroupMemberList',
			{pid, channelId, limit, offset},
			callback
		)
	}

	queryGroupAdminList(pid, channelId, limit, offset, callback) {
		doAsyncFetch.call(this,
			serverName,
			'queryGroupAdminList',
			{pid, channelId, limit, offset},
			callback
		)
	}

	queryApplyList(pid, channelId, limit, offset, callback) {
		doAsyncFetch.call(this,
			serverName,
			'queryApplyList',
			{pid, channelId, limit, offset},
			callback
		)
	}

	getActivityListByChannel(pid, channelId, sortField = 'createDate', offset, limit, order = -1, activityTag, callback) {
		doAsyncFetch.call(this,
			'/ActivityService.0.0',
			'getActivityListByChannel',
			{productKey, pid, channelId, sortField, offset, limit, order, activityTag},
			callback
		)
	}

	batchRemoveChannelActivity(pid, channelId, aidList, callback) {
		doAsyncFetch.call(this,
			'/ActivityService.0.0',
			'batchRemoveChannelActivity',
			{productKey, pid, channelId, aidList},
			callback
		)
	}

  searchGroupMember(pid, channelId, name, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'searchGroupMember',
      {pid, channelId, name, limit, offset},
      callback
    )
  }

	queryMyGroupList(pid, params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/GroupService.0.0', (client) => {
					client.queryMyGroupList({ pid, targetPid: params.targetPid, limit: params.limit, offset: params.offset });
				})
			];
		}).end(function(results) {
			if(callback){
				callback(results[0]);
			}
		});
	}
}


// util
function doAsyncFetch(serviceName, actionName, params, callback) {
	const singleAction = TypeOf(actionName) === 'String';

  this.asyncFetchHelper.need(['soap']).then(function(soap){
		let tasks = [];
		if (singleAction) {
			tasks.push(getTask(soap, serviceName, actionName, params))
		} else {
			tasks = actionName.map(({action, params}) => getTask(soap, serviceName, action, params))
		}

    return tasks;
  }).end(function(results){
		let res = singleAction
			? results[0]
			: {
					response: actionName.reduce((final, curr, index) => {
							final[curr.name] = results[index].response;
							return final;
						}, {})
				}

    if(callback) callback(res);
  });

	function getTask(soap, serviceName, actionName, params) {
		return soap(serviceName, function handleConnectionSoap(client){
				client[actionName](params);
			})
	}
}

export default GroupService;
