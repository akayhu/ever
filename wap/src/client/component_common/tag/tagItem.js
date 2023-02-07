import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const TagItem = ({
	text,
	deleteItem
}) =>
	<div styleName="tag_item" onClick={ deleteItem } data-gtm-tag="activity">
		<div>{ text }<i className="cross icon" /></div>
	</div>;

export default CSSModules(TagItem, css);
