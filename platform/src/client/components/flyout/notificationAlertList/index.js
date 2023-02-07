import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AlertBlock from '../alertBlock';
import AlertItem from './alertItem';
import { getNotificationDataById } from '../../../reducers/navigation/selectors';

const NotificationAlertList = ({ notificationList, userPid, error }) => {
	return <AlertBlock
		domain="notification"
		userPid={ userPid }
		title={ "通知" }
		readMoreText={ "所有訊息" }
		readMoreLink={ "/notification" }
		listData={ notificationList }
		contentElement={ <AlertItem /> }
		error={ error }
	/>
};

NotificationAlertList.propTypes = {
	notificationList: PropTypes.arrayOf(PropTypes.any).isRequired,
	userPid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	error: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
	return {
		userPid: state.user.pid,
		notificationList: getNotificationDataById(state),
		error: state.notification.error
	};
}

export default connect(mapStateToProps)(NotificationAlertList);
