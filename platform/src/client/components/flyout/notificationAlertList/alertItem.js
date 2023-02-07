import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import timeago from '../../../../util/timeago';
import Image from '../../../components/image';
import css from './style.css';

const AlertList = (props) => {
	const { iconUrl, createDate, message, targetLink, triggerId } = props;
	const time = timeago(new Date(createDate).toString());
	return (
		<dd styleName="alertItem">
			<div styleName="left">
				<Image type={ 'avatar' } src={ iconUrl } />
			</div>
			<div>
				<a href={ targetLink } title={ message }>
					<div styleName="content">{ message }</div>
					<div styleName="time">{ time }</div>
				</a>
			</div>
		</dd>
	);
};

AlertList.propTypes = {
	iconUrl: PropTypes.string
};

export default CSSModules(AlertList, css);
