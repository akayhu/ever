import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import pure from 'recompose/pure';
import css from './index.css';

const Headline = ({headline}) =>
	<div styleName="title" className="h1">
		<span>{headline}</span>
	</div>;

Headline.propTypes = {
	headline: PropTypes.string.isRequired
};

export default compose(
	pure,
	[CSSModules, '_', css]
)(Headline);
