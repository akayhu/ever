import React from 'react';
import CSSModules from 'react-css-modules';
import css from './style.css';
import { Link } from 'react-router';

const SocialSubtitle = ({	link,	gtm,	count, unit }) =>
	<div styleName="subtitle">
		共
		<Link to={ link } data-gtm-profile-social={ gtm }>
			{ count }
		</Link>
		{ unit }
	</div>;

export default CSSModules(SocialSubtitle, css);
