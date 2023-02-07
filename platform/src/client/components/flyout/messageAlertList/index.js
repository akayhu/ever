import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from '../../../../util/compose';
import { getCcMessageData } from '../../../reducers/navigation/selectors';
import AlertBlock from '../alertBlock';
import AlertItem from './alertItem';

const MessageAlertList = ({ msgList, userPid, push }) => (
	<AlertBlock
		domain="ccCommunication"
		userPid={ userPid }
		title={ "最新訊息" }
		readMoreText={ "所有訊息" }
		readMoreLink={ "/message/cc" }
		listData={ msgList }
		contentElement={ <AlertItem linkToPage={ push } /> }
	/>
);

MessageAlertList.propTypes = {
	msgList: PropTypes.arrayOf(PropTypes.any).isRequired,
	userPid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	push: PropTypes.func.isRequired
};

function mapStateToProps(state, {router}) {
	return {
		userPid: state.user.pid,
		msgList: getCcMessageData(state),
		push: router.push
	};
}

export default compose(
	withRouter,
	connect(mapStateToProps, null)
)(MessageAlertList);
