import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusSpace = ({subComponents}) =>
	<div styleName="plus_space">
		{'　'}
		{subComponents}
	</div>;

export default CSSModules(PlusSpace, css);
