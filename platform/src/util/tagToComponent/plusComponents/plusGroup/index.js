import React from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusGroup = ({channelid, content, subComponents, _followed}) => {
	return (
		<div styleName="plus_group">
			{channelid ?
				<a href={ `/group/${channelid}` }>
					<span styleName="content_text">{content}</span>
				</a> :
				<span styleName="content_text">{content}</span>
			}
			{subComponents}
			{_followed}
		</div>
	);
}

export default CSSModules(PlusGroup, css);
