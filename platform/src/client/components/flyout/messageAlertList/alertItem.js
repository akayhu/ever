import React from 'react';
import CSSModules from 'react-css-modules';
import timeago from '../../../../util/timeago';
import Image from '../../../components/image';
// style
import css from './style.css';

const AlertList = ({ spicture, oname, text, inputDate, isRead, linkToPage, chatId }) => {
	const memberName = oname.slice(0, 3).join('、');
	const memberCount = oname.length;
	const componentStyle = {backgroundColor: isRead ? 'white' : '#f9f9f9'};
	return (
		<dd
			styleName="ccAlertItem"
			style={ componentStyle }
			onClick={ linkToPage.bind(this, `/message/cc?chatId=${chatId}`) }
		>
			<Image
				type={ 'avatar' }
				className={css.messageImg}
				src={ spicture }
			/>
			<div styleName="messageMain">
				<div styleName="messageName">{memberName}{memberCount > 1 && `(${memberCount})`}</div>
				<div styleName="messageContent">{text}</div>
				<div styleName="messageTime">
					{timeago(inputDate)}{isRead && <i className="icon checked" />}
				</div>
			</div>
		</dd>
	);
};

export default CSSModules(AlertList, css);
