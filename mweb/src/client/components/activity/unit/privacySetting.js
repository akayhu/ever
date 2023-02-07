import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './privacySetting.css';

// components

const PrivacySetting = ({ privacySetting }) =>
	<i className={ privacySetting } styleName="privacySetting" />;

PrivacySetting.defaultProps = {
	privacySetting: 'world icon',
};

PrivacySetting.propTypes = {
	privacySetting: PropTypes.string.isRequired,
};

export default CSSModules(PrivacySetting, css, { allowMultiple: true });
