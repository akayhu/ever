import React from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';

const	PlusActivity = ({activityid, content, subComponents, _followed}) => 
	<div styleName="plus_activity">
		<a href={ `/activity/${activityid}` }>
			<span styleName="content_text">{content}</span>
		</a>
		{subComponents}
		{_followed}
	</div>;

export default CSSModules(PlusActivity, css);
