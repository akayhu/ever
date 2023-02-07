import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusLink = ({subComponents}) =>
	<div styleName="plus_link">
		{subComponents}
	</div>;

export default CSSModules(PlusLink, css);
