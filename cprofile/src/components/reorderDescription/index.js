import React from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components';

const DescriptionSpan = styled.span`
	position: absolute;
	left: 115px;
	font-size: 14px;
	font-weight: bolder;
	color: #00bddd;
	top: 10px;
	cursor: pointer;
	> {
		&:nth-child(2) {
			margin-left: 1em;
		}
	}
`;

const ReorderDescription = props => {
	const description =
		props.blockType === 'education'
			? '系統會判斷學歷先後順序，自動重新排序'
			: '結果會依時間先後重新排序';
	const lengthDescription =
		props.blockType === 'education'
			? '學校名稱及主修 / 科系為必填，學校名稱限100字元數，主修/科系限100字元數。'
			: '職稱 / 角色及公司名稱為必填，職稱 / 角色限150字元數，公司名稱限150字元數。';
	return (
		<DescriptionSpan>
			<Tooltip placement="top" title={description}>
				依時間排序
			</Tooltip>
			<Tooltip placement="top" title={lengthDescription}>
				說明
			</Tooltip>
		</DescriptionSpan>
	);
};

export default ReorderDescription;
