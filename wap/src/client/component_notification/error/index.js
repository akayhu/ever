import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const EError = () =>
	<div styleName="error">
		<div>發生錯誤，請稍後再試</div>
	</div>;

export default CSSModules(EError, css);
