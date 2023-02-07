export function viewDataProcessing(obj, viewas) {
	const resultObj = Object.assign({}, obj);
	resultObj.startTime = `${obj.startYear}.${obj.startMonth}`;
	resultObj.privacySettingIcon = (obj.privacySetting === 1) ? 'world icon' : 'lock icon';

	switch (obj.type) {
		case 'edu':
			resultObj.endTime = (obj.degreeStatus === 3 || obj.degreeStatus === '3') ? '迄今' : `${obj.endYear}.${obj.endMonth}`;
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
					} else if (obj.relation.type === 'edu' && (obj.relation.degree === 1 || obj.relation.degree === '1')) {
						resultObj.relationDesc = obj.relation.schoolName;
					} else if (obj.relation.type === 'edu' && (obj.relation.degree !== 1 || obj.relation.degree !== '1')) {
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
	resultObj.startTime = (resultObj.startTime.length === 6) ?
		`${resultObj.startTime.slice(0, 5)}0${resultObj.startTime.slice(5)}-`
		:
		`${resultObj.startTime}-`;
	if (resultObj.endTime.length === 6) resultObj.endTime = `${resultObj.endTime.slice(0, 5)}0${resultObj.endTime.slice(5)}`;

	return resultObj;
}

export function ACData(key, array) {
	let valueKey = '';
	switch (key) {
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
		default:
			valueKey = '';
	}
	for (let x = 0, xLength = array.length; x < xLength; x += 1) {
		array[x].value = array[x][valueKey];
	}
	return array;
}
