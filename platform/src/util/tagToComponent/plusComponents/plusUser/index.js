import React from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusUser = ({targetpid, content, subComponents, _followed}) =>
	<div styleName="plus_user">
		<a href={ `/profile/${targetpid}` }>
			<span styleName="content_text">{content}</span>
		</a>
		{subComponents}
		<span>{_followed}</span>
	</div>;

export default CSSModules(PlusUser, css);
