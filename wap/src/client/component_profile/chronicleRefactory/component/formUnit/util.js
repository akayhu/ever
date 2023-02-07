import request from 'superagent';

export function initData(data, createMode) {
	let dataKey = ['eventId', 'startYear', 'startMonth', 'endYear', 'endMonth', 'privacySetting', 'returnType'];
	let appendKey = [];
	const resultObj = {};

	switch (data.type) {
		case 'exp':
			appendKey = [
				'jobTitle', 'companyName', 'expAreaInput', 'expArea',
				'jobNote', 'stillWork', 'jobCat', 'companySize', 'publicStock', 'indCat', 'invoice'
			];
			break;
		case 'edu':
			appendKey = ['schoolName', 'major', 'eduAreaInput', 'eduArea', 'degree', 'degreeStatus', 'majorCat', 'schoolId', 'majorId'];
			break;
		case 'honor':
			appendKey = ['title', 'tagList', 'relationId', 'description'];
			break;
		default:
			break;
	}

	dataKey = dataKey.concat(appendKey);

	if (createMode) {
		// create 走這邊
		for (let x = 0, xLength = dataKey.length; x < xLength; x += 1) {
			const keyName = dataKey[x];
			resultObj[keyName] = '';
		}
		switch (data.type) {
			case 'exp':
			case 'exp-temp':
				resultObj.stillWork = false;
				break;
			case 'edu':
			case 'edu-temp':
				resultObj.degreeStatus = 1;
				resultObj.degree = null;
				break;
			case 'honor':
				resultObj.tagList = ['管理'];
				break;
			default:
				break;
		}
		delete resultObj.eventId;
	} else {
		// edit 走這邊
		for (let x = 0, xLength = dataKey.length; x < xLength; x += 1) {
			const keyName = dataKey[x];
			if (data.hasOwnProperty(keyName) && data[keyName] !== null) {
				resultObj[keyName] = data[keyName];
			} else {
				resultObj[keyName] = '';
			}
		}
		if (data.type === 'exp' && data.expAreaInput === null && data.expAreaDesc !== null) resultObj.expAreaInput = data.expAreaDesc;
		if (data.type === 'edu' && data.eduAreaInput === null && data.eduAreaDesc !== null) resultObj.eduAreaInput = data.eduAreaDesc;
		if (data.type === 'honor' && data.relation !== null) resultObj.relationId = data.relation.eventId;

		if (resultObj.hasOwnProperty('degreeStatus') && resultObj.degreeStatus === '') resultObj.degreeStatus = 1; // edu-temp default data;
	}
	resultObj.returnType = 2;
	resultObj.privacySetting = 1; // Phase 2 remember to remove.
	return resultObj;
}

export function checkboxSelect(key, obj) {
	switch (key) {
		case 'stillWork':
			return (obj.length !== 0);
		default:
			return '';
	}
}

export function dropListDefault(defaultValue, targetArray) {
	let index = 0;
	for (let i = 0, num = targetArray.length; i < num; i += 1) {
		if (targetArray[i].value === defaultValue) index = i + 1;
	}
	return index;
}

export function radioDefault(defaultValue, tagList) {
	for (const index in tagList) {
		if (defaultValue === tagList[index].value) return index;
	}
	return tagList.length;
}

export function autoComplete(key, value, callback) {
	const ajaxUrl = `/ajax/autoComplete/${key}/${value}`;
	request
		.get(ajaxUrl)
		.end((err, res) => {
			const newArrayObj = {};
			newArrayObj[key] = res;
			callback(newArrayObj);
		});
}
