import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusAppraise = ({content, subComponents, _followed}) =>
	<div styleName="plus_appraise">
		<span styleName="content_text">{content}</span>
		{subComponents}
		{_followed}
	</div>;

export default CSSModules(PlusAppraise, css);
