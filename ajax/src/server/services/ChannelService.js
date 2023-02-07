import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

const TypeOf = (obj) => Object.prototype.toString.call(obj).match(/\s(\w+)]/)[1]

const serverName = '/MediaChannelService.0.0';
const productKey = config.params.apnum;

class MediaChannelService {

  static getInstance() {
		if(!this.mediaChannelService){
			this.mediaChannelService = new this;
		}

		return this.mediaChannelService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.mediaChannelService = null;
	}

	getMediaList(pid, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getMediaList',
      {pid, limit, offset},
      callback
    )
	}

  getSubscribeMediaList(pid, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getSubscribeMediaList',
      {pid, limit, offset},
      callback
    )
	}

  subscribeMedia(pid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'subscribeMedia',
      {pid, channelId},
      callback
    )
	}

  unsubscribeMedia(pid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'unsubscribeMedia',
      {pid, channelId},
      callback
    )
	}

  getMediaListByNewActivity(pid, day, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getMediaListByNewActivity',
      {pid, day, limit, offset},
      callback
    )
  }

  addMediaRole(pid, channelId, targetPid, role, callback) {
    doAsyncFetch.call(this,
      serverName,
      'addMediaRole',
      {pid, channelId, targetPid, role},
      callback
    )
	}

  deleteMediaRole(pid, channelId, targetPid, callback) {
    doAsyncFetch.call(this,
      serverName,
      'deleteMediaRole',
      {pid, channelId, targetPid},
      callback
    )
	}

  getMediaInfo(pid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getMediaInfo',
      {pid, channelId},
      callback
    )
	}

  updateMedia(pid, channelId, coverFid, coverPicDrag, avatarFileId, avatarCoordinate, description, callback) {
    doAsyncFetch.call(this,
      serverName,
      'updateMedia',
      {pid, channelId, coverFid, coverPicDrag, avatarFileId, avatarCoordinate, description},
      callback
    )
  }

  inviteSubscribeMedia(pid, targetPid, channelId, callback) {
    doAsyncFetch.call(this,
      serverName,
      'inviteSubscribeMedia',
      {pid, targetPid, channelId},
      callback
    )
	}

  getMediaMemberList(pid, channelId, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getMediaMemberList',
      {pid, channelId, limit, offset},
      callback
    )
  }

  getMediaRoleList(pid, channelId, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getMediaRoleList',
      {pid, channelId, limit, offset},
      callback
    )
  }

  searchMediaMember(pid, channelId, name, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'searchMediaMember',
      {pid, channelId, name, limit, offset},
      callback
    )
	}

  getChannIdByNameUrl(name, callback) {
    doAsyncFetch.call(this,
      '/MediaChannelServiceForBackstage.0.0',
      'getChannIdByNameUrl',
      {name},
      callback
    )
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

export default MediaChannelService;
