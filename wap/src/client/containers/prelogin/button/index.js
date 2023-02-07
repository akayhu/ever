import React from 'react';
import css from './index.css';
import CSSModules from 'react-css-modules';


/*
	[props]
	- btnClass
	- text
	- gtmTag
	- url
*/

const Button = props => (
	<a href={ props.url } target={ props.target || '_self' } rel="noopener noreferrer">
		<button styleName={ props.btnClass } data-gtm-common={ props.gtmTag }>{ props.text }</button>
	</a>
);

export default CSSModules(Button, css, {allowMultiple: true});
