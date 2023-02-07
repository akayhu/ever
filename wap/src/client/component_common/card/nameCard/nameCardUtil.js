import $ from 'jquery';

const nameCardUtil = {

	nameCardKey : [ 'pid', 'userName', 'companyName', 'jobTitle', 'schoolName', 'major', 'count', 'avatarWebUrl' ],

	init: function(){
		let newObject = {};
		for(let x=0, num = this.nameCardKey.length; x<num; x++){
			let keyName = this.nameCardKey[x];
			newObject[keyName] = '';
		}
		return newObject;
	},
	getSubscribe: function(viewerPid, targetPid, callback, offset = 0, limit = 10) {
		const ajaxUrl = `/ajax/connection/getFollowList?pid=${viewerPid}&targetPid=${targetPid}&direction=2&limit=${limit}&offset=${offset}`;
		
		$.ajax({
			method: 'get',
			url: ajaxUrl,
			success: (result) => {
				if('response' in result){
					for(let x=0, num = this.nameCardKey.length; x<num; x++){
						let keyName = this.nameCardKey[x];
						if(!(keyName in result.response))result.response[keyName] = '';
					}
					callback(result.response);
				}
			}
		});
	},
	getMutualFriend: function( viewerPid, targetPid, callback, offset = 0, limit = 10 ){
		let ajaxUrl = '/ajax/connection/getMutualFriendList?pid='+viewerPid+'&targetPid='+targetPid+'&direction=1&limit='+limit+'&offset='+offset;
		
		$.ajax({
			method: 'get',
			url: ajaxUrl,
			success: (result) => {
				if('response' in result){
					for(let x=0, num = this.nameCardKey.length; x<num; x++){
						let keyName = this.nameCardKey[x];
						if(!(keyName in result.response))result.response[keyName] = '';
					}
					callback(result.response);
				}
			}
		});
	}
}

export default nameCardUtil;
