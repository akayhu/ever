import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusApprove = ({content, subComponents, _followed}) =>
	<div styleName="plus_approve">
		<span styleName="content_text">{content}</span>
		{subComponents}
		{_followed}
	</div>;

export default CSSModules(PlusApprove, css);
