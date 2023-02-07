import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PlusClass = ({classurl, content, subComponents, _followed}) => {
	return (
		<div styleName="plus_class" >
			<a href={ '//' + classurl }>
				<span styleName="content_text">{content}</span>
			</a>
			{subComponents}
			<span>{_followed}</span>
		</div>
	)
}


export default CSSModules(PlusClass, css);
