import React from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusChannel = ({channelid, content, subComponents, _followed, channeltype}) => {
	let linkurl;
	if (channeltype == 7 || channeltype == 8) {
		linkurl = `/group/${channelid}`;
	} else {
		linkurl = `/channel/${channelid}`;
	}
	return (
		<div styleName="plus_channel">
			<a href={ linkurl }>
				<span styleName="content_text">{content}</span>
			</a>
			{subComponents}
			{_followed}
		</div>
	);
}

export default CSSModules(PlusChannel, css);
