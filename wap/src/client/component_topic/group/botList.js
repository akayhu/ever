import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import ListBlock from '../listBlock';


const renderList = (listData, checkLogin) => {
	const list = listData.map((obj, index) => {
		const btnPropInfo = {
			channelId: obj.id,
			isHead: obj.isHead,
			isMember: obj.isMember,
			isApplying: obj.isApplying,
			joinSetting: obj.joinSetting,
			noticeStatus: obj.noticeStatus
		};


		return (
			<ListBlock
				id={ obj.id }
				domain="group"
				key={ index }
				itemImg={ obj.coverWebUrl }
				itemTit={ obj.name }
				itemView={ `已有 ${obj.memberCount} 名成員加入` }
				itemContent={ obj.description }
				subscribeInfo={ btnPropInfo }
				checkLogin={ checkLogin }
			/>
		);
	});
	return list;
};

const BotList = ({listData, checkLogin}) => {
	const list = renderList(listData, checkLogin);
	return (<ul styleName="groupMain">{ list }</ul>);
};

export default CSSModules(BotList, css);
