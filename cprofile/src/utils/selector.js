import { Map, fromJS, List } from 'immutable';
import nameMap from 'config/nameMap';
import schema from 'config/schema';
import honorSchema from 'config/honorSchema';
import { validateDataModel } from 'utils/validation';

const config = fromJS({
	nameMap,
	schema,
});

/**
 * 過濾該區塊未填寫完整的資料
 * @param {string} blockType
 * @param {Map or List} data
 */
export const stripIncompleteData = (
	blockType = '',
	data,
	schemaConfig,
	preview
) => {
	if (!config.hasIn(['nameMap', blockType])) {
		console.error('Invalid blockType in stripIncompleteData: ', blockType);
		return null;
	}

	if (!data) {
		console.log('Invalid data in stripIncompleteData: ', data);
		return null;
	}

	const schema = config.getIn(['schema', blockType]).toJS();
	const uidName = config.getIn(['nameMap', blockType, 'uidName']);

	// 單筆資料區塊
	if (Map.isMap(data)) {
		const templateType = schemaConfig.templateType;
		const noFileTemplates = ['def', 'text'];
		const doNotCheckFile =
			blockType === 'honor' && noFileTemplates.includes(templateType);
		if (/tmp-/gi.test(data.get(uidName))) return null;
		if (
			!(doNotCheckFile || preview
				? validateDataModel(data.toJS(), honorSchema)
				: validateDataModel(data.toJS(), schema))
		)
			return null;
		return data;
	}

	// 多筆資料區塊
	if (List.isList(data)) {
		const templateType = schemaConfig.templateType;
		const noFileTemplates = ['def', 'text'];
		const doNotCheckFile =
			blockType === 'honor' && noFileTemplates.includes(templateType);
		const validData = data.filter(item =>
			!/tmp-/gi.test(item.get(uidName)) && (doNotCheckFile || preview)
				? validateDataModel(item.toJS(), honorSchema)
				: validateDataModel(item.toJS(), schema)
		);
		if (!validData || !validData.size) return null;
		return validData;
	}

	console.log('Data must be either Map or List in stripIncompleteData: ', data);
	return null;
};
