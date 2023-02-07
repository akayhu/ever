import $ from 'jquery';
import Promise from 'bluebird';

const contentTypeMap = {
	TEXT: 1,
	IMAGE: 2,
	VIDEO: 3,
	DOCUMENT: 4,
	AUDIO: 5,
	HYPERLINK: 6,
	LINK: 6
};

const activityUnit = {
	suggestEndorseByContent(content) {
		const params = {
			content,
			limit: 5
		};
		return $.ajax({
			method: 'POST',
			url: '/ajax/activity/suggestEndorse',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(params)
		});
	},

	endorseAC(value) {
		return new Promise((resolve) => {
			const getValueUrl = `/ajax/autoComplete/ability/${value}`;
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
			const getValueUrl = '/ajax/connection/getAllFriendList';
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
	makeExtra(entityMap) {
		let extraJson = {
			tagUser: [],
			attachmentList:[]
		},
			mentionName = {};

		for (const key in entityMap) {
			const fileObj = entityMap[key];
			const type = fileObj.type;

			if (type !== 'mention') {
				extraJson.attachmentList.push({ fid: fileObj.data.fileId, contentType: contentTypeMap[type] });
			} else {
				if (fileObj.data.mention.id) {
					var resultItem = fileObj.data.mention.id;
				}else {
					var resultItem = fileObj.data.mention["_root"].entries[0][1];
				}
				if (!mentionName.hasOwnProperty(resultItem)) {
					mentionName[resultItem] = true;
					extraJson.tagUser.push(resultItem);
				}
			}
		}
		return extraJson;
	}
};

export default activityUnit;
