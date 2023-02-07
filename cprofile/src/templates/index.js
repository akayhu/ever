import React from 'react';
import { fromJS, Map } from 'immutable';
import honor from './default/honor-component';
import education from './default/education-component';
import experience from './default/experience-component';
import gallery from './default/gallery-component';
import talent from './default/talent-component';
import basic from './default/basic-component';
import behance from './default/behance-component';
import github from './default/github-component';
import plus_activity from './default/plus-activity-component';
import custom from './default/custom-component';
import placeHolder from './placeHolder';
import './style.css';

const templatesMap = {
	honor,
	education,
	experience,
	gallery,
	talent,
	basic,
	behance,
	github,
	placeHolder,
	custom,
	plus_activity,
};

const Template = ({ data, config, meta, commonMode }) => {
	if (!config || !config.blockType) return null;

	const TemplatesByBlock = templatesMap[config.blockType];
	if (!TemplatesByBlock) return null;

	const Target =
		TemplatesByBlock[config.templateType || 'def'] || TemplatesByBlock.def;

	// 不是每個模板都有 mask，再加上 mask 資料結構嵌套很深，以 immutable 來處理查詢比較保險
	const modifiedMask = fromJS(config.mask) || Map();
	return (
		<Target
			data={data}
			config={{ ...config, mask: modifiedMask }}
			meta={meta}
			commonMode={commonMode}
		/>
	);
};

Template.defaultProps = {
	meta: {
		editable: false,
		canDrag: false,
		feildOnChange: () => {},
		imageUpload: () => {},
	},
	config: {},
};

export default Template;
