import AsyncFetchHelper from 'async-fetch-helper';
import config from 'src/configs/config';

class ConnectionService {

	static getInstance() {
		if(!this.connectionService){
			this.connectionService = new this;
		}

		return this.connectionService;
	}

	constructor() {
		this.asyncFetchHelper = new AsyncFetchHelper({
			apiUrl : config.params.apiUrl.esb
		});
		this.connectionService = null;
	}

	getConnectionStatus(pid, targetPidList, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getConnectionStatus({'pid': pid, 'targetPid': targetPidList});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getFriendList(pid, targetPid, limit, offset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getFriendList({pid: pid, targetPid: targetPid, limit: limit, offset: offset});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getAllFriendList(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getAllFriendList({pid: pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getInviteList(pid, connectionStatus, limit, offset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getInviteList({connectionStatus: connectionStatus, limit: limit, offset: offset, pid: pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getFollowList(pid, targetPid, direction, limit, offset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getFollowList({pid: pid, targetPid: targetPid, direction: direction, limit: limit, offset: offset});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getMutualFriendList(pid, targetPid, limit, offset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getMutualFriendList({pid: pid, targetPid: targetPid, limit: limit, offset: offset});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getMayKnowPeopleList(pid, limit, offset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getMayKnowPeopleList({pid: pid, limit: limit, offset: offset});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getExcellentPeopleList(pid, mediaLimit, mediaOffset, peopleLimit, peopleOffset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getExcellentPeopleList({pid: pid, mediaLimit: mediaLimit, mediaOffset: mediaOffset, peopleLimit: peopleLimit, peopleOffset: peopleOffset});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getRejectList(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getRejectList({pid: pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getExcludeList(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getExcludeList({pid: pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getBlockList(pid, limit, offset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getBlockList({pid: pid, limit: limit, offset: offset});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getNamecardConnectionInfo(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getNamecardConnectionInfo({pid: pid, targetPid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	searchFriend(pid, keyword, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.searchFriend({pid: pid, keyword: keyword});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getGroupItemList(pid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getGroupItemList({pid: pid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	getGroupMemberList(pid, groupId, limit, offset, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.getGroupMemberList({pid: pid, groupId: groupId, limit: limit, offset: offset});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	invite(pid, targetPid, relationType, memo, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.invite({pid: pid, targetPid: targetPid, relationType: relationType, memo: memo});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	accept(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.accept({pid: pid, targetPid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	reject(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.reject({pid: pid, targetPid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	revoke(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.revoke({pid: pid, targetPid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	disconnect(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.disconnect({pid: pid, targetPid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	subscribe(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.subscribe({pid: pid, targetPid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	unsubscribe(pid, targetPid, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.unsubscribe({pid: pid, targetPid: targetPid});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
	notice(pid, targetPid, status, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.notice({pid: pid, targetPid: targetPid, status: status});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}


	exclude(pid, targetPid, status, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.exclude({pid: pid, targetPid: targetPid, status: status});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	block(pid, targetPid, blockStatus, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.block({pid: pid, targetPid: targetPid, blockStatus: blockStatus});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	join(pid, targetPid, groupId, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.join({pid: pid, targetPid: targetPid, groupId: groupId});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	createGroup(pid, groupName, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.createGroup({pid: pid, groupName: groupName});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	updateGroupName(pid, groupId, groupName, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.updateGroupName({pid: pid, groupId: groupId, groupName: groupName});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}

	deleteGroup(pid, groupId, callback){
		this.asyncFetchHelper.need(['soap']).then(function(soap){
			return [
				soap('/ConnectionService.0.0', function handleConnectionSoap(client){
					client.deleteGroup({pid: pid, groupId: groupId});
				})
			];
		}).end(function(results){
			if(callback){
				callback(results[0]);
			}
		});
	}
}

export default ConnectionService;
