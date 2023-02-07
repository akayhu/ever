import $ from 'jquery';
import Promise from 'bluebird';
import config from 'src/configs/client';

const activityUnit = {
	suggestEndorseByContent(content) {
		const params = {
			content,
			limit: 5
		};
		return $.ajax({
			method: 'POST',
			url: config.params.remoteDataUrl+'/ajax/activity/suggestEndorse',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(params)
		});
	},

	endorseAC(value) {
		return new Promise((resolve) => {
			const getValueUrl = config.params.remoteDataUrl+`/ajax/autoComplete/ability/${value}`;
			$.get(getValueUrl, (res) => {
				var result = [];
				res.Result.map((item) => { result.push({value: item.fun_descript}); });
				if (result.length > 0) {
					resolve({result});
				} else {
					resolve({result: [{value: '搜尋不到符合的項目，請重新輸入'}]});
				}
			});
		});
	},

	getAllFriendList() {
		return new Promise((resolve) => {
			const getValueUrl = config.params.remoteDataUrl+'/ajax/connection/getAllFriendList';
			$.get(getValueUrl, (res) => {
				let mention = [];
				$.each(res.response, (index, value) => {
					const item = {
						id: value.pid,
						link: `/profile/${value.pid}`,
						name: value.userName,
						avatar: value.avatarWebUrl
					};
					if (value.hiddenStatus === false) mention.push(item);
				});
				resolve(mention);
			});
		});
	},

	getMentionList(entity) {
		if(entity.hasOwnProperty('entityMap')) {
			var resultObj = {
				resultArray: []
			};
			for (const key in entity.entityMap) {
				if (entity.entityMap[key].type === 'mention') {
					var resultItem = (entity.entityMap[key].data.mention.hasOwnProperty('_root')) ?
						entity.entityMap[key].data.mention['_root'].entries[0][1]
						:
						entity.entityMap[key].data.mention.id; //

					if (!resultObj.hasOwnProperty(resultItem)) resultObj.resultArray.push(resultItem);

					resultObj[resultItem] = resultItem;
				}
			}
			return resultObj.resultArray;
		}
	},

	makeExtra: function( entityMap ){
		var extraJson = {
			tagUser: [],
			attachmentList:[]
		},
			mentionName = {};
		for(let key in entityMap){
			var fileObj = entityMap[key];
			var type = fileObj.type;
			var contentType = 1;
			var resultObj = {
				resultArray: []
			};
			if( type !== 'mention') {
				var fid = fileObj.data.fileId;
			}
			switch (type) {
				case 'TEXT':
					contentType = 1;
					break;
				case 'IMAGE':
					contentType = 2;
					break;
				case 'VIDEO':
					contentType = 3;
					break;
				case 'DOCUMENT':
					contentType = 4;
					break;
				case 'AUDIO':
					contentType = 5;
					break;
				case 'HYPERLINK':
				case 'LINK':
					contentType = 6;
					break;
				case 'mention':
					if( fileObj.data.mention.id ) {
						var resultItem = fileObj.data.mention.id;
					}else {
						var resultItem = fileObj.data.mention["_root"].entries[0][1];
					}
					if (!mentionName.hasOwnProperty(resultItem)) {
						mentionName[resultItem] = true;
						extraJson.tagUser.push(resultItem);
					}
					break;
			}
			extraJson.attachmentList.push({ fid: fid, contentType: contentType });
		}
		return extraJson;
	}
}


export default activityUnit;
