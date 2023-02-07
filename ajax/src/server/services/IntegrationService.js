import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

// 取得篩選後的欄位資訊
function getResponseResult(result, params, item) {
	let dataList = [];
	let tempSubItem = {};
	let tempSubArray = [];

	// 判斷是否要過濾子層 dataList 的內容
	if (typeof params[item] !== 'undefined') {
		dataList = result[item];
		let listLength = dataList.length;
		if(typeof listLength === 'number'){
			// 如果子層是 jsonArray
			for(var j = 0; j < listLength; j++){
				tempSubItem = {};
				params[item].map(function(subItem){
					tempSubItem[subItem] = getResponseResult(dataList[j], params, subItem)
				});
				tempSubArray.push(tempSubItem);
			}
			return tempSubArray;
		}else{
			// 如果子層是 jsonObject
			tempSubItem = {};
			params[item].map(function(subItem){
				tempSubItem[subItem] = getResponseResult(result[item], params, subItem)
			});
			return tempSubItem;
		}
	}else{
		// 如果不需要過濾子層就直接回傳結果
		return result[item];
	}
}

class IntegrationService {
	
	static getInstance() {
		if(!this.integrationService){
			this.integrationService = new this;
		}
		
		return this.integrationService;
	}
	
	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.integrationService = null;
	}

	getServerTime(params, callback) {
		callback({
			response: {
				time: new Date().getTime()
			}
		})
	}
	
	getMyWish(pid, params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			try{
				let services = [];
				let jsonArray = JSON.parse(params.json);
				let count = jsonArray.length;

				jsonArray.map(function(item){
					services.push(
						soap('/' + item.service + '.0.0', function handleNotificationSoap(client){
							item.param["productKey"] = config.params.apnum;
							item.param["pid"] = pid;
							if (typeof client[item.method] !== 'undefined') {
								client[item.method](item.param);	
							}else{
								throw new Error("unknown method");
							}
						})
					);
				});

				return services;
			}catch(err){
                return {
					errorCode: 500,
					errorMsg: err
				};
            }
		}).end(function(results){
			let res = {};
			res.response = {};
			try{
				let jsonArray = JSON.parse(params.json);

				// service 迴圈
				for(var i = 0; i < jsonArray.length; i++){
					if (typeof jsonArray[i].returnValue !== 'undefined') {
						// 過濾每個 service 需要的回傳值
						jsonArray[i].returnValue.map(function(item){
							// 取得篩選後的欄位資訊
							if(results[i].response !== null){
								if (typeof jsonArray[i].returnType !== 'undefined' && jsonArray[i].returnType === 'boolean') { 
									// 如果是只需要回傳布林值，就不用再帶入欄位名稱
									res.response = getResponseResult(results[i].response, jsonArray[i], item);	
								}else{
									res.response[item] = getResponseResult(results[i].response, jsonArray[i], item);	
								}
							}else{
								res.response = results[i].response;
							}
						});
					}else{
						// 沒有指定 returnValue 就回傳全部結果
						res.response = results[i].response;
					}
				}
				
				if (typeof res.response === 'undefined') {
					res.response = {};
				}
			}catch(e) {
				res = {
					errorCode: 500,
					errorMsg: e
				}
	    }
			
	    if(callback){
				callback(res);
			}
		});
	}
}

export default IntegrationService;