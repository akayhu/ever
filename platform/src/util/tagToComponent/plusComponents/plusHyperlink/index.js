import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusHyperlink = ({url, content, subComponents}) =>
	<div styleName="plus_hyperlink">
		<a href={ url }>
			<span styleName="content_text">{content}</span>
		</a>
		{subComponents}
	</div>;

export default CSSModules(PlusHyperlink, css);
