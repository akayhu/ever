import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getInviteData } from '../../../reducers/navigation/selectors';
import AlertBlock from '../alertBlock';
import AlertItem from './alertItem';

const ConnectionAlertList = ({ inviteList, userPid }) => (
	<AlertBlock
		domain="connection"
		userPid={ userPid }
		title={ "收到的邀請" }
		readMoreText={ "看更多交友邀請" }
		readMoreLink={ `/profile/${userPid}/connection?mode=invitations` }
		listData={ inviteList }
		contentElement={ <AlertItem /> }
	/>
);

ConnectionAlertList.propTypes = {
	inviteList: PropTypes.arrayOf(PropTypes.any).isRequired,
	userPid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function mapStateToProps(state) {
	return {
		userPid: state.user.pid,
		inviteList: getInviteData(state),
	};
}

export default connect(mapStateToProps, null)(ConnectionAlertList);
