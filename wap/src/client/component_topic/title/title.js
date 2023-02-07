import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import pure from 'recompose/pure';
import css from './index.css';

const Title = ({mainTitle}) => <div styleName="mainTitle" className="h2">{mainTitle}</div>;

Title.propTypes = {
	mainTitle: PropTypes.string.isRequired
};

export default compose(
	pure,
	[CSSModules, '_', css]
)(Title);
