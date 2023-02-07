import React from 'react';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusApplypublicgroup = ({groupid, content, subComponents, _followed}) =>
	<div styleName="plus_applypublicgroup">
		<a href={ `/group/${groupid}` }>
			<span styleName="content_text">{content}</span>
		</a>
		{subComponents}
		{_followed}
	</div>;

export default CSSModules(PlusApplypublicgroup, css);
