import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import './style.scss';

const AlertBanner = ({ className, message, type, showIcon, closable }) => (
	<Alert
		className={`alert-banner ${className}`}
		message={message}
		type={type}
		showIcon={showIcon}
		closable={closable}
		banner
	/>
);

AlertBanner.propTypes = {
	/** 提示文案 */
	message: PropTypes.string,
	/** 提示類型 */
	type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
	/** 是否顯示 icon */
	showIcon: PropTypes.bool,
	/** 是否可以關閉 */
	closable: PropTypes.bool,
	/** 自定義 css class */
	className: PropTypes.string,
};

AlertBanner.defaultProps = {
	message: '',
	type: 'warning',
	showIcon: true,
	closable: true,
	className: '',
};

export default AlertBanner;
