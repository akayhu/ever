import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const EndorseItem = ({
	text,
	deleteItem
}) =>
	<div styleName="endorse_item" onClick={ deleteItem }>
		<div>{ text }<i className="cross icon" /></div>
	</div>;

export default CSSModules(EndorseItem, css);
