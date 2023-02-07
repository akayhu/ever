import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const RelativeItem = ({
	title,
	name,
	itemClick
}) =>
	<a styleName="relative_item" onClick={ itemClick }>
		<span> • </span>
		<span styleName="title">
			{ title }
		</span>
		<span styleName="author">
			╱ { name }
		</span>
	</a>;

export default CSSModules(RelativeItem, css);
