import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
import CSSModules from 'react-css-modules';

const Experience = ({companyName, jobTitle, schoolName, major, connectionStatus}) => {
	if (connectionStatus === 4) return null;

	const Job = () => {
		if (!companyName || !jobTitle) return null;
		return (
			<p> { jobTitle }　{ companyName } </p>
		);
	};

	const Education = () => {
		if (!schoolName || !major) return null;
		return (
			<p> { schoolName }　{ major } </p>
		);
	};

	return (
		<div styleName="introduction">
			<Job />
			<Education />
		</div>
	);
};

Experience.propTypes = {
	companyName: PropTypes.string,
	jobTitle: PropTypes.string,
	schoolName: PropTypes.string,
	major: PropTypes.string,
	connectionStatus: PropTypes.number.isRequired
};

export default CSSModules(Experience, css);
