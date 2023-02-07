import $ from 'jquery';

const chronicleUtil = {
	init(type) {
		let dataMappingKey = ['startYear', 'startMonth', 'endYear', 'endMonth', 'privacySetting', 'returnType'];
		let appendKey = [];
		let resultObj = {};

		switch(type) {
			case 'exp':
				appendKey = ['jobTitle', 'companyName', 'expAreaInput', 'expArea', 'jobNote', 'stillWork', 'jobCat', 'companySize', 'publicStock', 'indCat', 'invoice'];
				break;
			case 'edu':
				appendKey = ['schoolName', 'major', 'eduAreaInput', 'eduArea', 'degree', 'degreeStatus', 'majorCat', 'schoolId', 'majorId'];
				break;
			case 'honor':
				appendKey = ['title', 'tagList', 'relationId', 'description'];
				break;
			default:
				dataMappingKey = [];
				break;
		}

		dataMappingKey = dataMappingKey.concat(appendKey);

		for (let x = 0, xLength = dataMappingKey.length; x < xLength; x += 1) {
			const keyName = dataMappingKey[x];
			resultObj[keyName] = '';
		}

		switch(type) {
			case 'exp':
				resultObj.stillWork = false;
				break;
			case 'edu':
				resultObj.degreeStatus = 1;
				resultObj.degree = null;
				break;
			case 'honor':
				resultObj.tagList = ['管理'];
				break;
		}

		resultObj.returnType = 2;
		resultObj.privacySetting = 1;
		return resultObj;
	},

	mapping(type, obj) {
		let dataMappingKey = ['eventId', 'startYear', 'startMonth', 'endYear', 'endMonth', 'privacySetting', 'returnType'];
		let appendKey = [];
		let resultObj = {};

		switch(type) {
			case 'exp':
			case 'exp-temp':
				appendKey = ['jobTitle', 'companyName', 'expAreaInput', 'expArea', 'jobNote', 'stillWork', 'jobCat', 'companySize', 'publicStock', 'indCat', 'invoice'];
				break;
			case 'edu':
			case 'edu-temp':
				appendKey = ['schoolName', 'major', 'eduAreaInput', 'eduArea', 'degree', 'degreeStatus', 'majorCat', 'schoolId', 'majorId'];
				break;
			case 'honor':
				appendKey = ['title', 'tagList', 'relationId', 'description'];
				break;
			default:
				dataMappingKey = [];
				break;
		}

		dataMappingKey = dataMappingKey.concat(appendKey);

		for (let x = 0, xLength = dataMappingKey.length; x < xLength; x += 1) {
			const keyName = dataMappingKey[x];
			if (obj.hasOwnProperty(keyName) && obj[keyName] !== null) {
				resultObj[keyName] = obj[keyName];
			} else {
				resultObj[keyName] = '';
			}
		}
		if(type === 'exp' && obj['expAreaInput'] === null && obj['expAreaDesc'] !== null) resultObj['expAreaInput'] = obj['expAreaDesc'];
		if(type === 'edu' && obj['eduAreaInput'] === null && obj['eduAreaDesc'] !== null) resultObj['eduAreaInput'] = obj['eduAreaDesc'];
		if(type === 'honor' && obj.relation !== null)resultObj.relationId = obj.relation.eventId;

		if (resultObj.hasOwnProperty('degreeStatus') && resultObj.degreeStatus === '') resultObj.degreeStatus = 1; // edu-temp default data;

		resultObj.returnType = 2;
		return resultObj;
	},

	viewDataProcessing(obj, viewas) {
		const resultObj = {};
		resultObj.startTime = `${obj.startYear}.${obj.startMonth}`;
		resultObj.privacySettingIcon = (obj.privacySetting === 1) ? 'world icon' : 'lock icon';

		switch (obj.type) {
			case 'edu':
				resultObj.endTime = obj.degreeStatus == 3 ? '迄今' : `${obj.endYear}.${obj.endMonth}`;
				resultObj.desc = `，${obj.degreeDesc}${obj.degreeStatusDesc}`;
				if (obj.eduAreaInput !== null && obj.eduAreaInput !== '') {
					resultObj.eduArea = `（${obj.eduAreaInput}）`;
				} else if (obj.eduAreaDesc !== null && obj.eduAreaDesc !== '') {
					resultObj.eduArea = `（${obj.eduAreaDesc}）`;
				} else {
					resultObj.eduArea = '';
				}
				break;
			case 'exp':
				resultObj.endTime = obj.stillWork ? '迄今' : `${obj.endYear}.${obj.endMonth}`;
				resultObj.desc = `，年資${obj.seniority}`;
				if (obj.expAreaInput !== null && obj.expAreaInput !== '') {
					resultObj.expArea = `（${obj.expAreaInput}）`;
				} else if (obj.expAreaDesc !== null && obj.expAreaDesc !== '') {
					resultObj.expArea = `（${obj.expAreaDesc}）`;
				} else {
					resultObj.expArea = '';
				}
				break;
			case 'honor':
				if (obj.hasOwnProperty('relation') && obj.relation !== null) {
					if (obj.relation.privacySetting === 1 || viewas === 'self') {
						if (obj.relation.type === 'exp') {
							resultObj.relationDesc = `${obj.relation.jobTitle}   /   ${obj.relation.companyName}`;
						} else if(obj.relation.type === 'edu' && obj.relation.degree == 1) {
							resultObj.relationDesc = obj.relation.schoolName;
						} else if (obj.relation.type === 'edu' && obj.relation.degree != 1) {
							resultObj.relationDesc = `${obj.relation.major}   /   ${obj.relation.schoolName}`;
						}
					}
				} else {
					resultObj.relationDesc = '';
				}
				resultObj.endTime = `${obj.endYear}.${obj.endMonth}`;
				break;
			default:
				resultObj.area = '';
				resultObj.endTime = `${obj.endYear}.${obj.endMonth}`;
				break;
		}
		resultObj.startTime = (resultObj.startTime.length === 6)?resultObj.startTime.slice(0,5) + '0' + resultObj.startTime.slice(5) + ' - ' : resultObj.startTime + ' - ';
		if(resultObj.endTime.length === 6)resultObj.endTime = resultObj.endTime.slice(0,5) + '0' + resultObj.endTime.slice(5);
		return resultObj;
	},

	ACData(key, array) {
		let valueKey = '';
		switch(key) {
			case 'companyName':
				valueKey = 'company_name';
				break;
			case 'jobTitle':
				valueKey = 'job_title';
				break;
			case 'schoolName':
				valueKey = 'u_name';
				break;
			case 'major':
				valueKey = 'eduname';
				break;
			case 'area':
				valueKey = 'DESCRIPT';
				break;
		}
		for (let x = 0, xLength = array.length; x < xLength; x += 1) {
			array[x].value = array[x][valueKey];
		}
		return array;
	},

	checkboxChange(key, obj) {
		switch (key) {
			case 'stillWork':
				return (obj.length !== 0);
			default:
				return '';
		}
	},

	radioDefaultMapping(defaultValue, tagList) {
		for (const index in tagList) {
			if (defaultValue === tagList[index].value) return index;
		}
		return tagList.length;
	},

	dropListDefaultIndex(defaultValue, targetArray) {
		let index = 0;
		for (let i = 0, num = targetArray.length; i < num; i += 1) {
			if (targetArray[i].value === defaultValue) index = i + 1;
		}
		return index;
	},

	relationListInit(relationList) {
		let newArray = [];
		if (relationList.length !== 0) {
			newArray.push({label: '　', value: null});
			for (let i = 0, num = relationList.length; i < num; i += 1) {
				let listItem = {};
				if (relationList[i].type === 'exp') {
					listItem.label = relationList[i].companyName + '-' + relationList[i].jobTitle;
				} else if (relationList[i].type === 'edu' && relationList[i].degree != 1) {
					listItem.label = relationList[i].schoolName + '-' + relationList[i].major;
				} else if (relationList[i].type === 'edu' && relationList[i].degree == 1) {
					listItem.label = relationList[i].schoolName;
				}
				listItem.value = relationList[i].eventId;
				listItem.startTime = JSON.stringify(relationList[i].startYear) + JSON.stringify(relationList[i].startMonth);
				listItem.endTime = JSON.stringify(relationList[i].endYear) + JSON.stringify(relationList[i].endMonth);
				if (relationList[i].type === 'exp' || relationList[i].type === 'edu') newArray.push(listItem); // 排除暫存資料
			}
		}
		return newArray;
	},

	businessLogicCheck(type, data) {
		var returnObj = { result: true, errorMessage: {} };
		switch(type) {
			case 'exp':
				returnObj.errorMessage = { companyName: '', jobTitle: '', startYear: 'dropList', startMonth: 'dropList', endYear: 'dropList', endMonth: 'dropList', period: ''};
				if (data.companyName.length === 0) {
					returnObj.errorMessage.companyName = '公司名稱不能為空值';
					returnObj.result = false;
				}
				if (data.companyName.length > 100) {
					returnObj.errorMessage.companyName = '公司名稱過長';
					returnObj.result = false;
				}
				if (data.jobTitle.length === 0) {
					returnObj.errorMessage.jobTitle = '職務名稱不能為空值';
					returnObj.result = false;
				}
				if (data.jobTitle.length > 100) {
					returnObj.errorMessage.jobTitle = '職務名稱過長';
					returnObj.result = false;
				}
				if (data.startYear.length === 0)	returnObj.errorMessage.startYear = 'dropList errorStyle';
				if (data.startMonth.length === 0) returnObj.errorMessage.startMonth = 'dropList errorStyle';
				if (data.startYear.length === 0 || data.startMonth.length === 0) {
					returnObj.errorMessage.period = '時間格式錯誤';
					returnObj.result = false;
				}
				if (!data.stillWork) {
					if (data.endYear.length === 0) returnObj.errorMessage.endYear = 'dropList errorStyle';
					if (data.endMonth.length === 0) returnObj.errorMessage.endMonth = 'dropList errorStyle';
					if (data.endYear.length === 0 || data.endMonth.length === 0) {
						returnObj.errorMessage.period = '時間格式錯誤';
						returnObj.result = false;
					}
					const startTime = data.startYear.toString() + ((data.startMonth.toString().length === 1) ? `0${data.startMonth.toString()}` : data.startMonth.toString());
					const endTime = data.endYear.toString() + ((data.endMonth.toString().length === 1) ? `0${data.endMonth.toString()}` : data.endMonth.toString());
					if (startTime.length > 4 && endTime.length > 4 && parseInt(startTime, 10) > parseInt(endTime, 10)) {
						returnObj.errorMessage.period = '開始時間不得超過結束時間';
						returnObj.result = false;
					}
				}
				if (data.jobNote.length > 1000) {
					returnObj.errorMessage.jobNote = '字數超過上限1000字';
					returnObj.result = false;
				}
				break;
			case 'edu':
				returnObj.errorMessage = { schoolName: '', major: '', startYear: 'dropList', startMonth: 'dropList', endYear: 'dropList', endMonth: 'dropList', period: '', degree: 'dropList', degreeError: ''};
				if (data.schoolName.length === 0) {
					returnObj.errorMessage.schoolName = '學校名稱不能為空值';
					returnObj.result = false;
				} else if (data.schoolName.length > 100) {
					returnObj.errorMessage.schoolName = '學校名稱過長';
					returnObj.result = false;
				}
				if (data.major.length === 0 && data.degree != 1) {
					returnObj.errorMessage.major = '科系名稱不能為空值';
					returnObj.result = false;
				} else if( data.major.length > 100 ) {
					returnObj.errorMessage.major = '科系名稱過長';
					returnObj.result = false;
				}
				if (data.degree == null || data.degree == '') {
					returnObj.errorMessage.degree = 'dropList errorStyle';
					returnObj.errorMessage.degreeError = '請選擇學歷';
					returnObj.result = false;
				}
				if (data.startYear.length === 0) returnObj.errorMessage.startYear = 'dropList errorStyle';
				if (data.startMonth.length === 0) returnObj.errorMessage.startMonth = 'dropList errorStyle';
				if (data.startYear.length === 0 || data.startMonth.length === 0) {
					returnObj.errorMessage.period = '時間格式錯誤';
					returnObj.result = false;
				}
				if (data.degreeStatus != 3) {
					if (data.endYear.length === 0) returnObj.errorMessage.endYear = 'dropList errorStyle';
					if (data.endMonth.length === 0) returnObj.errorMessage.endMonth = 'dropList errorStyle';
					if (data.endYear.length === 0 || data.endMonth.length === 0) {
						returnObj.errorMessage.period = '時間格式錯誤';
						returnObj.result = false;
					}
					const startTime = data.startYear.toString() + ((data.startMonth.toString().length === 1) ? `0${data.startMonth.toString()}` : data.startMonth.toString());
					const endTime = data.endYear.toString() + ((data.endMonth.toString().length === 1) ? `0${data.endMonth.toString()}` : data.endMonth.toString());
					if (startTime.length > 4 && endTime.length > 4 && parseInt(startTime, 10) > parseInt(endTime, 10)) {
						returnObj.errorMessage.period = '開始時間不得超過結束時間';
						returnObj.result = false;
					}
				}
				break;
			case 'honor':
				returnObj.errorMessage = { title: '', startYear: 'dropList', startMonth: 'dropList', endYear: 'dropList', endMonth: 'dropList', period: '', description: '', relation: '' };
				if (data.title.length === 0) {
					returnObj.errorMessage.title = '主題名稱不能為空';
					returnObj.result = false;
				}
				if (data.title.length > 100) {
					returnObj.errorMessage.title = '超過字數限制';
					returnObj.result = false;
				}
				if (data.startYear.length === 0) returnObj.errorMessage.startYear = 'dropList errorStyle';
				if (data.startMonth.length === 0) returnObj.errorMessage.startMonth = 'dropList errorStyle';
				if (data.endYear.length === 0) returnObj.errorMessage.endYear = 'dropList errorStyle';
				if (data.endMonth.length === 0) returnObj.errorMessage.endMonth = 'dropList errorStyle';
				if (data.startYear.length === 0 || data.startMonth.length === 0 || data.endYear.length === 0 || data.endMonth.length === 0) {
					returnObj.errorMessage.period = '時間格式錯誤';
					returnObj.result = false;
				}
				const startTime = data.startYear.toString() + ((data.startMonth.toString().length === 1) ? `0${data.startMonth.toString()}` : data.startMonth.toString());
				const endTime = data.endYear.toString() + ((data.endMonth.toString().length === 1) ? `0${data.endMonth.toString()}` : data.endMonth.toString());
				if (startTime.length > 4 && endTime.length > 4 && parseInt(startTime, 10) > parseInt(endTime, 10)) {
					returnObj.errorMessage.period = '開始時間不得超過結束時間';
					returnObj.result = false;
				}
				if (data.description.length === 0) {
					returnObj.errorMessage.description = '內容描述不能為空';
					returnObj.result = false;
				}
				if (data.description.length > 1000) {
					returnObj.errorMessage.description = '超過字數限制';
					returnObj.result = false;
				}
				break;
		}
		return returnObj;
	},

	autoComplete(keyname, keyvalue, callback) {
		const ajaxUrl = `/ajax/autoComplete/${keyname}/${keyvalue}`;
		$.get(ajaxUrl, (res) => {
			if (callback && typeof (callback) === 'function') {
				callback(res);
			}
		});
	},

	getDesc(value, callback) {
		const ajaxUrl = `/ajax/autoComplete/getDescript?noList=${value}&returnAll=1`;
		$.ajax({
			method: 'get',
			url: ajaxUrl,
			success: callback
		});
	}

};

export default chronicleUtil;
