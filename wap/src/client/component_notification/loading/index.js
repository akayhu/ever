import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const Loading = () =>
	<div styleName="loading">
		<div className="ui loading" />
	</div>;

export default CSSModules(Loading, css);
