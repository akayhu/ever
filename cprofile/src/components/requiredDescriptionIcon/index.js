import React from 'react';
import { Tooltip } from 'antd';
import './style.scss';

const RequiredDescriptionIcon = props => {
	const honorTemplateType = ['def', 'text'];
	const honorBlockType = ['honor'];
	const description = honorBlockType.includes(props.blockType)
		? `${
				!honorTemplateType.includes(props.templateType) ? '檔案、' : ''
		  }名稱、內容為必填`
		: '檔案、名稱、內容為必填';
	return (
		<Tooltip title={description}>
			<span className={`required-description notification ${props.blockType}`}>
				欄位皆必填
			</span>
		</Tooltip>
	);
};

export default RequiredDescriptionIcon;
