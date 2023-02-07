import React from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusGroup = ({channelid, groupid, content, subComponents, _followed}) => {
  let url = '';
  if (channelid) {
    url = `/group/${channelid}`;
  } else if (groupid) {
    url = `/group/${groupid}`;
  }
	return (
		<div styleName="plus_joinpublicgroup">
			{url ?
				<a href={ url }>
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
