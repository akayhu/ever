import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

const TypeOf = (obj) => Object.prototype.toString.call(obj).match(/\s(\w+)]/)[1]

const serverName = '/SubscribeFunctionService.0.0';
const productKey = config.params.apnum;

class SubscribeFunctionService {

	static getInstance() {
		if(!this.subscribeFunctionService){
			this.subscribeFunctionService = new this;
		}

		return this.subscribeFunctionService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.subscribeFunctionService = null;
	}

	getSubscribeList(pid, callback) {
    doAsyncFetch.call(this,
      serverName,
      'getSubscribeList',
      {pid},
      callback
    )
	}

	subscribe(pid, func, weights, callback) {
    doAsyncFetch.call(this,
      serverName,
      'subscribe',
      {pid, func, weights},
      callback
    )
	}

	unsubscribe(pid, func, callback) {
    doAsyncFetch.call(this,
      serverName,
      'unsubscribe',
      {pid, func},
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

export default SubscribeFunctionService;
