import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

const ShowMore = ({ handelShowLayer, gtmName}) => (
	<div styleName="more_section">
		<div styleName="more" onClick={ handelShowLayer } data-gtm-profile={ gtmName }>看更多</div>
		{/* <div styleName="linear_bg" /> */}
	</div>
);

export default CSSModules(ShowMore, css);
