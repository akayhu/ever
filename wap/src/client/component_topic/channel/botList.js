import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import ListBlock from '../listBlock';

const BotList = ({listData, checkLogin}) =>
	<ul styleName="groupMain">
		{listData.map((obj, index) => {

			const btnPropInfo = {
				channelId: obj.id,
				subscribeSetting: obj.subscribe,
				isAdmin: obj.isAdmin,
				isEditor: obj.isEditor
			};
			
			return (
				<ListBlock
					key={ index }
					id={ obj.id }
					domain="channel"
					itemImg={ obj.coverWebUrl }
					itemTit={ obj.name }
					itemView={ `${obj.subscribeCount} 關注` }
					itemContent={ obj.description }
					subscribeInfo={ btnPropInfo }
					checkLogin={ checkLogin }
				/>
			);
		})}
	</ul>;

export default CSSModules(BotList, css);
