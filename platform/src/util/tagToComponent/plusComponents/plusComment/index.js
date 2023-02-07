import React from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';

const	PlusComment = ({activityid, content, subComponents, _followed}) => 
	<div styleName="plus_activity">
		<a href={ `/activity/${activityid}` }>
      <span styleName="content_text">{subComponents}</span>
		</a>
		{_followed}
	</div>;

export default CSSModules(PlusComment, css);
