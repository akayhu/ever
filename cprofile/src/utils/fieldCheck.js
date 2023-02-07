/* 主要用來檢查各個必填欄位長度是否符合規範,並跳出提示視窗
	autoComplete 的口跟 schema 不同 , 所以下面會出現 jobTitle 對 jobName 這種寫法
*/

import { pushSystemMessage } from 'actions/ui/systemMessage';
import schema from 'config/schema';
import { fromJS } from 'immutable';
import store from 'store';

//basic 欄位跟其他欄位在 schema 上有重複,因此先短解在一開始就做檢查

const pushBasicBlockWarning = (checkField, textLength, maxLenCb) => {
	switch (checkField) {
		case 'userName':
			if (textLength > maxLenCb('userName')) {
				store.dispatch(
					pushSystemMessage(
						`姓名字數不能超過 ${maxLenCb('userName')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'jobTitle':
			if (textLength > maxLenCb('title')) {
				store.dispatch(
					pushSystemMessage(
						`職稱 / 角色字數不能超過 ${maxLenCb('title')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'companyName':
			if (textLength > maxLenCb('organization')) {
				store.dispatch(
					pushSystemMessage(
						`公司名稱字數不能超過 ${maxLenCb('organization')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'location':
			if (textLength > maxLenCb('location')) {
				store.dispatch(
					pushSystemMessage(
						`現居地點不能超過 ${maxLenCb('location')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'introduction':
			if (textLength > maxLenCb('introduction')) {
				store.dispatch(
					pushSystemMessage(
						`個人簡介不能超過 ${maxLenCb('introduction')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		default:
			return true;
	}
};

export const handleFieldCheck = (blockType, checkField, inputText) => {
	const len = inputText.length;
	const checkSchema = fromJS(schema);
	const minLen = field =>
		checkSchema.getIn([blockType, 'properties', field, 'minLength']);
	const maxLen = field =>
		checkSchema.getIn([blockType, 'properties', field, 'maxLength']);
	if (blockType === 'basic') {
		return pushBasicBlockWarning(checkField, len, maxLen);
	}

	switch (checkField) {
		case 'jobTitle':
			if (len < minLen('jobName')) {
				store.dispatch(pushSystemMessage(`職稱 / 角色 為必填！`, 'warning'));
			}
			if (len > maxLen('jobName')) {
				store.dispatch(
					pushSystemMessage(
						`職稱 / 角色字數不能超過 ${maxLen('jobName')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'companyName':
			if (len < minLen('companyName')) {
				store.dispatch(pushSystemMessage(`公司名稱 為必填！`, 'warning'));
			}
			if (len > maxLen('companyName')) {
				store.dispatch(
					pushSystemMessage(
						`公司名稱字數不能超過 ${maxLen('companyName')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'schoolName':
			if (len < minLen('schoolName')) {
				store.dispatch(pushSystemMessage(`學校名稱 為必填！`, 'warning'));
			}
			if (len > maxLen('schoolName')) {
				store.dispatch(
					pushSystemMessage(
						`學校名稱字數不能超過 ${maxLen('schoolName')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'major':
			if (len < minLen('majorName')) {
				store.dispatch(
					pushSystemMessage(`主修 / 科系名稱 為必填！`, 'warning')
				);
			}
			if (len > maxLen('majorName')) {
				store.dispatch(
					pushSystemMessage(
						`主修 / 科系名稱字數不能超過 ${maxLen('majorName')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'ability':
			if (len < minLen('tag')) {
				store.dispatch(pushSystemMessage(`專長、技能名稱 為必填！`, 'warning'));
			}
			if (len > maxLen('tag')) {
				store.dispatch(
					pushSystemMessage(
						`專長、技能名稱字數不能超過 ${maxLen('tag')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'honor':
			if (len < minLen('title')) {
				store.dispatch(
					pushSystemMessage(`專案 / 成就名稱 為必填！`, 'warning')
				);
			}
			if (len > maxLen('title')) {
				store.dispatch(
					pushSystemMessage(
						`專案 / 成就名稱字數不能超過 ${maxLen('title')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'gallery':
			if (len < minLen('title')) {
				store.dispatch(pushSystemMessage(`作品集名稱 為必填！`, 'warning'));
			}
			if (len > maxLen('title')) {
				store.dispatch(
					pushSystemMessage(
						`作品集名稱字數不能超過 ${maxLen('title')} 個字！`,
						'warning'
					)
				);
				return false;
			}
			return true;
		case 'custom':
			if (len < minLen('title')) {
				store.dispatch(pushSystemMessage(`客製化名稱 為必填！`, 'warning'));
			}
			return true;
		case 'description':
			if (len > maxLen('description')) {
				store.dispatch(
					pushSystemMessage(
						`經歷描述不能超過 ${maxLen('description')} 個字!`,
						'warning'
					)
				);
				return false;
			}
			return true;
		default:
			return true;
	}
};
