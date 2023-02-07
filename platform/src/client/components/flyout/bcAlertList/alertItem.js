import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import timeago from '../../../../util/timeago';
// style
import css from './style.css';

const AlertList = ({ custName, jobName, content, inputDate, isRead, linkToPage, jobNo }) => {
	const componentStyle = { backgroundColor: isRead ? 'white' : '#f9f9f9' };
	return (
		<dd
			styleName="bcAlertItem"
			style={ componentStyle }
			onClick={ linkToPage.bind(this, `/message/bc?jobNo=${jobNo}`) }
		>
			<div styleName="bcAlertMain">
				<div styleName="bcAlertHrName">{ jobName }</div>
				<div styleName="bcAlertCompany">{ custName }</div>
				<div styleName="bcAlertContent">{ content }</div>
				<div styleName="bcAlertTime">
					{ timeago(inputDate) }
					{ isRead && <i className="icon checked" /> }
				</div>
			</div>
		</dd>
	);
};

export default CSSModules(AlertList, css);
