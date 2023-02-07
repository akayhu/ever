import React from 'react';
import CSSModules from 'react-css-modules';
import css from './unit.css';

const ShowMoreBtn = ({ showAllTrigger, total, text }) =>
	<div styleName="readmore" >
		<div styleName="readmoreBtn" onClick={ showAllTrigger }>共{ total }筆{ text }全部展開</div>
	</div>;

export default CSSModules(ShowMoreBtn, css, { allowMultiple: true });
