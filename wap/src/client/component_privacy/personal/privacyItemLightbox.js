import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';

const PrivacyItemLightbox = ({ title, desc, children }) => (
	<div styleName="privacy_item_lb">
		<div styleName="left">
			<p styleName="title">{ title }</p>
			<p dangerouslySetInnerHTML={ {__html: desc} } />
		</div>
		<div styleName="right">
			{ children }
		</div>
	</div>
  );

PrivacyItemLightbox.propTypes = {
	title: PropTypes.string,
	desc: PropTypes.string,
	children: PropTypes.element
};

export default CSSModules(PrivacyItemLightbox, css);
