import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class BcCommunicationService {

	static getInstance() {
		if(!this.bcCommunicationService){
			this.bcCommunicationService = new this;
		}

		return this.bcCommunicationService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.BCAsyncFetchHelper = new AsyncFetchHelper({
			apiUrl : 'http://172.19.1.220/axis2/services'
		});
		this.bcCommunicationService = null;
	}

	uploadNewBCAttach(pid, json_string, callback){
		this.BCAsyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicateAttachFile', function handleConnectionSoap(client){
					client.uploadNewBCAttach({ json_string: json_string, returnAll: true });
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	getMsgList(pid, pageNo, pageRow, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.getMsgList({'pid': pid, 'pageNo': pageNo, 'pageRow': pageRow});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	setContactInfo(pid, cellphone, custNo, isAgree, jobNo, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.setContactInfo({'pid': pid, 'cellphone': cellphone, 'custNo': custNo, 'isAgree': isAgree, 'jobNo': jobNo});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	sendMsg(
		pid, 
		custNo, 
		custName, 
		jobNo, 
		jobName, 
		profileStatus, 
		status, 
		content, 
		attachment, 
		attachmentId, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.sendMsg({
						'pid': pid, 
						'custNo': custNo, 
						'custName': custName,
						'jobNo': jobNo,
						'jobName': jobName,
						'profileStatus': profileStatus,
						'status': status,
						'content': content,
						'attachment': attachment,
						'attachmentId': attachmentId
					});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}


	getMsgDetail(pid, jobNo, updateRead, pageNo, pageRow, asc, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.getMsgDetail({'pid': pid, 'jobNo': jobNo, 'updateRead': updateRead, 'pageNo': pageNo, 'pageRow': pageRow, 'asc': asc});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getUnreadMsgCnt(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.getUnreadMsgCnt({'pid': pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getContactInfo(pid, custNo, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.getContactInfo({'pids': pid, 'custNo': custNo});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	queryPidStatus(pid, custNo, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.queryPidStatus({'pid': pid, 'custNo': custNo});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	baseConvert(jobNo, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.baseConvert({'jobNo': jobNo});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAttachFile(pid, custNo, msgId, attachNum, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.getAttachFile({'pid': pid, 'custNo': custNo, 'msgId': msgId, 'attachNum': attachNum});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getCompanyLogo(custNo, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/BcCommunicationService.0.0', function handleConnectionSoap(client){
					client.getCompanyLogo({'custNo': custNo});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default BcCommunicationService;
