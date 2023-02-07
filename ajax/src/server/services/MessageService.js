import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class MessageService {

	static getInstance() {
		if(!this.messageService){
			this.messageService = new this;
		}

		return this.messageService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.asyncFetchHelperIntesb = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.intesb
		});
		this.messageService = null;
	}

	getMessageList(pid, count, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.getMessageList({'productKey': config.params.apnum, 'pid': pid, 'count': count});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getMessageListByTime(pid, count, dateTime, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.getMessageListByTime({'productKey': config.params.apnum, 'pid': pid, 'count': count, 'dateTime': dateTime});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getChatList(chatId, pid, count, dateTime, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.getChatList({'productKey': config.params.apnum, 'chatId': chatId, 'pid': pid, 'count': count, 'dateTime': dateTime});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getChatroomId(pid, memberList, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.getChatroomId({'productKey': config.params.apnum, 'pid': pid, 'memberList': memberList});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getMemberIdList(chatId, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.getMemberIdList({'productKey': config.params.apnum, 'chatId': chatId});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAllChatroomIdByPid(pid, count, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.getAllChatroomIdByPid({'productKey': config.params.apnum, 'pid': pid, 'count': count});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	newMessage(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.newMessage(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	newMessageWithFile(pid, memberList, text, extraJson, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.newMessageWithFile({'productKey': config.params.apnum, pid, memberList, text, extraJson});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	sendMessage(params, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.sendMessage(params);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	setChatroomStatus(chatId, pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.setChatroomStatus({'productKey': config.params.apnum, 'chatId': chatId, 'pid': pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	deleteChatroomContent(pid, chatId, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.deleteChatroomContent({'productKey': config.params.apnum, 'pid': pid, 'chatId': chatId});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	deleteMessage(pid, messageList, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.deleteMessage({'productKey': config.params.apnum, 'pid': pid, 'messageList': messageList});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	setChatroomMute(pid, chatId, muteFlag, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.setChatroomMute({'productKey': config.params.apnum, 'pid': pid, 'chatId': chatId, 'muteFlag': muteFlag});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getMessageBubbleCount(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.getMessageBubbleCount({'productKey': config.params.apnum, 'pid': pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	setMessageBubbleTime(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleConnectionSoap(client){
					client.setMessageBubbleTime({'productKey': config.params.apnum, 'pid': pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	
	getClientToken(pid, ip, callback){
		const time = (new Date()).getTime() + (60*60*1000*24);
		
		this.asyncFetchHelperIntesb.need(['soap']).then(function(soap){
			return [
				soap('/TokenService.0.0', function handleConnectionSoap(client){
					const obj = {cid:config.params.tokenCid, pid, ip, time, returnAll: true};
					console.log('obj', obj);
					client.getClientToken(obj);
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getChatroomMuteStatus(pid, chatId, callback) {
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/MessageService.0.0', function handleNotificationSoap(client){
					client.getChatroomMuteStatus({'productKey': config.params.apnum, pid, chatId});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default MessageService;
