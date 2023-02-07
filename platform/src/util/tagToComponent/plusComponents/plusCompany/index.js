import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusCompany = ({content, subComponents, _followed}) =>
	<div styleName="plus_company">
		<span styleName="content_text">{content}</span>
		{subComponents}
		{_followed}
	</div>;

export default CSSModules(PlusCompany, css);
