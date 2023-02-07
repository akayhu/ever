import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';
import DocumentService from './DocumentService';

const documentServiceInstance = DocumentService.getInstance();

const TypeOf = (obj) => Object.prototype.toString.call(obj).match(/\s(\w+)]/)[1]

const serverName = '/FunctionStatisticService.0.0';
const productKey = config.params.apnum;

class FunctionStatisticService {

	static getInstance() {
		if(!this.functionStatisticService){
			this.functionStatisticService = new this;
		}

		return this.functionStatisticService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.functionStatisticService = null;
	}

	getEndorseList(func, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getEndorseList',
      {func},
      callback
    )
	}

  getEndorsePeopleList(pid, func, item, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getEndorsePeopleList',
      {pid, func, item, limit, offset},
      callback
    )
	}

	initEndorseSection(pid, func, callback) {
	  this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/FunctionStatisticService.0.0', (client) => {
					client.getEndorseList({'func': func}, (res) => {
						let arrayEndorsePeopleList = [];
						for(let i of res.response) {
							arrayEndorsePeopleList.push(
								soap('/FunctionStatisticService.0.0', (client) => {
									client.getEndorsePeopleList({
										'pid': pid,
										'func': func,
										'item': i.id,
										// 大於三筆會有看更多
										'limit': 5,
										'offset': 0
									});
								})
							)
						}
						return arrayEndorsePeopleList;
					})
				})
			];
		}).end(function(results){
			if(callback){
				if (errorHandle(results[0], callback)) return;
				if (emptyHandle(results, callback, results[0].response.length)) return;
				let res = {'response': []};
				for (let i = 0; i < results[0].response.length; i++) {
					if (errorHandle(results[0].childResult[i])) {
						res.response.push({
							id: results[0].response[i].id,
							count: results[0].response[i].count,
							offset: 0,
							total: 0,
							hasNext: false,
							dataList: []
						})
					} else {
						res.response.push({
							id: results[0].response[i].id,
							count: results[0].response[i].count,
							offset: results[0].childResult[i].response.offset,
							total: results[0].childResult[i].response.total,
							hasNext: results[0].childResult[i].response.hasNext,
							dataList: results[0].childResult[i].response.dataList
						})
					}
				}
				callback(res);
			}
		});
	}

  getFollowedList(pid, func, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getFollowedList',
      {pid, func, limit, offset},
      callback
    )
	}

	getWorkspaceListHot(productKey = 10400, pid, funcName, topic, offset, limit, activityTag, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap) {
			return [
				soap('/ActivityService.0.0', (client) => {
					client.getWorkspaceListHot({
						productKey,
						pid,
						funcName,
						topic,
						offset,
						limit,
						activityTag
					})
				})
			]
		}).end(function(results) {
			// callback(results[0])
			if (callback) {
				if (errorHandle(results[0], callback)) return;
				if (emptyHandle(results, callback, results[0].response.activityList.length)) return;
				let endResults = {'response': results[0].response};
				let params = {
					getFileArr: []
				}
				// 組geFileUrl的params
				for (let item of endResults.response.activityList) {
					let itemAttachInfo = item.extraInfo.attachmentList;
					if (itemAttachInfo.length > 0 && itemAttachInfo[0].activityFileId !== null) {
						params.getFileArr.push({
							fileId: itemAttachInfo[0].activityFileId,
							protocol: 'http',
							fileTag: ''
						})
					}
				}
				// let index = 0;
				// documentServiceInstance.getFileUrl(params, (res) => {
				// 	// callback(res)
				// 	try {
				// 		for (let item of endResults.response.activityList) {
				// 			let itemAttachInfo = item.extraInfo.attachmentList;
				// 			if (itemAttachInfo.length > 0 && itemAttachInfo[0].activityFileId !== null) {
				// 				itemAttachInfo[0].activityFileId = res[index].convertStatus === 'success' ? res[index].url[0] : '';
				// 				index += 1;
				// 			}
				// 		}
				// 	} catch(e) {
				// 		console.log('###################')
				// 		console.log('RES')
				// 		console.log(res)
				// 		console.log('###################')
				// 		console.log('INDEX')
				// 		console.log(index)
				// 	}
				//
				// 	callback(endResults)
				// });
				callback(endResults)
			}
		})
	}

	getGalleryList(pid, func, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getGalleryList',
      {pid, func, limit, offset},
      callback
    )
	}

	getGroupList(pid, func, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getGroupList',
      {pid, func, limit, offset},
      callback
    )
	}

	initGroupSection(pid, func, callback) {
	  this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/FunctionStatisticService.0.0', (client) => {
					client.getGroupList({'pid': pid, 'func': func, 'limit': 10, 'offset': 0}, (res) => {
						if (res.response.total === 0) return;
						return [
							soap('/ActivityService.0.0', (client) => {
								client.getActivityListByChannel({
									'pid': pid,
									'productKey': 10400,
									'channelId': res.response.dataList[0].id,
									'sortField': 'createDate',
									// 大於五筆會有看更多
									'limit': 6,
									'offset': 0,
									'order': -1
								});
							})
						]
					})
				})
			];
		}).end(function(results){
			if(callback){
				if (errorHandle(results[0], callback)) return;
				if (emptyHandle(results, callback, results[0].response.dataList.length)) return;
				let res = {'response': results[0].response};
				if (results[0].response.total > 0) {
					if (results[0].childResult[0].response && results[0].childResult[0].response.hasOwnProperty('activityList')) {
						res.response.dataList[0].activityList = results[0].childResult[0].response.activityList;
					} else {
						res.response.dataList[0].activityList = [];
					}
				}
				callback(res);
			}
		});
	}

	getHonorList(pid, func, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getHonorList',
      {pid, func, limit, offset},
      callback
    )
	}

	initHonorSection(pid, func, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getHonorList',
      {
				pid,
				func,
				// 大於五筆會有看更多
				limit: 6,
				offset: 0
			},
      callback
    )
	}

	// initHonorSection(pid, func, callback) {
	// 	this.asyncFetchHelper.need(['soap']).then(function(soap) {
	// 		return [
	// 			soap('/FunctionStatisticService.0.0', (client) => {
	// 				client.getHonorList({
	// 					'pid': pid,
	// 					'func': func,
	// 					'limit': 10,
	// 					'offset': 0
	// 				}, (res) => {
	// 					let arrayHonorList = [];
	// 					for(let i of res.response.dataList) {
	// 						arrayHonorList.push(
	// 							soap('/ProfileNameCardService.0.0', function (client){
	// 								client.getNameCard({
	// 									'pid': pid,
	// 									'targetPid': i.pid
	// 								});
	// 							})
	// 						)
	// 					}
	// 					return arrayHonorList;
	// 				})
	// 			})
	// 		]
	// 	}).end(function(results) {
	// 		if (callback) {
	// 			if (errorHandle(results[0], callback)) return;
	// 			if (emptyHandle(results, callback, results[0].response.dataList.length)) return;
	// 			let res = {
	// 				'response': {
	// 					'offset': results[0].response.offset,
	// 					'total': results[0].response.total,
	// 					'hasNext': results[0].response.hasNext,
	// 					'dataList': []
	// 				}
	// 			};
	// 			for (var i = 0; i < results[0].response.dataList.length; i++) {
	// 				res.response.dataList.push(
	// 					Object.assign(
	// 						results[0].response.dataList[i],
	// 						{nameCard: results[0].childResult[i].response}
	// 					)
	// 				)
	// 			}
	// 			callback(res);
	// 		}
	// 	})
	// }


	getMediaList(pid, func, limit, offset, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getMediaList',
      {pid, func, limit, offset},
      callback
    )
	}

	initMediaSection(pid, func, callback) {
	  this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/FunctionStatisticService.0.0', (client) => {
					// 大於四筆會有看更多
					client.getMediaList({'pid': pid, 'func': func, 'limit': 5, 'offset': 0}, (res) => {
						if (res.response.total === 0) return;
						return [
							soap('/ActivityService.0.0', (client) => {
								client.getActivityListByChannel({
									'pid': pid,
									'productKey': 10400,
									'channelId': res.response.dataList[0].id,
									'sortField': 'createDate',
									// 大於五筆會有看更多
									'limit': 6,
									'offset': 0,
									'order': -1
								});
							})
						]
					})
				})
			];
		}).end(function(results){
			if(callback){
				if (errorHandle(results[0], callback)) return;
				if (emptyHandle(results, callback, results[0].response.dataList.length)) return;
				let res = {'response': results[0].response};
				if (results[0].response.total > 0) {
					if (results[0].childResult[0].response && results[0].childResult[0].response.hasOwnProperty('activityList')) {
						res.response.dataList[0].activityList = results[0].childResult[0].response.activityList
					} else {
						res.response.dataList[0].activityList = [];
					}
				}
				callback(res);
			}
		});
	}

	getRelatedFunction(pid, func, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getRelatedFunction',
      {pid, func},
      callback
    )
	}

	initRelatedSection(pid, func, callback) {
	  this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/FunctionStatisticService.0.0', (client) => {
					client.getRelatedFunction({'pid': pid, 'func': func}, (res) => {
						const arrayRelatedList = []
						for(let i of res.response) {
							arrayRelatedList.push(
								soap('/FunctionStatisticService.0.0', (client) => {
									client.getFollowedList({
										'pid': pid,
										'func': i,
										// 超過三筆會有看更多
										'limit': 4,
										'offset': 0
									});
								})
							)
						}
						return arrayRelatedList;
					})
				})
			];
		}).end(function(results){
			if(callback){
				if (errorHandle(results[0], callback)) return;
				if (emptyHandle(results, callback, results[0].response.length)) return;
				let res = {'response': []};
				for(let i = 0; i < results[0].response.length; i++) {
					if (errorHandle(results[0].childResult[i])) {
						res.response.push({
							id: results[0].response[i],
							offset: 0,
							total: 0,
							hasNext: false,
							dataList: []
						})
					} else {
						res.response.push({
							id: results[0].response[i],
							offset: results[0].childResult[i].response.offset,
							total: results[0].childResult[i].response.total,
							hasNext: results[0].childResult[i].response.hasNext,
							dataList: results[0].childResult[i].response.dataList
						})
					}
				}
				callback(res);
			}
		});
	}

}

// util
function errorHandle(results, callback) {
	if (results.hasOwnProperty('errorCode') === true) {
		if (callback) {
			callback(results);
			return true;
		}
		return true;
	}
}

function emptyHandle(results, callback, dataLength) {
	if (dataLength === 0) {
		callback(results[0]);
		return true;
	}
}

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

export default FunctionStatisticService;
