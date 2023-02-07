import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from '../../../../util/compose';
import { getMsgData } from '../../../reducers/navigation/selectors';
import AlertBlock from '../alertBlock';
import AlertItem from './alertItem';

const BcAlertList = ({ msgList, userPid, push }) => (
	<AlertBlock
		domain="bcCommunication"
		userPid={ userPid }
		title={ "貴人來敲門" }
		readMoreText={ "所有訊息" }
		readMoreLink={ "/message/bc" }
		listData={ msgList }
		contentElement={ <AlertItem linkToPage={ push } /> }
	/>
);

BcAlertList.propTypes = {
	msgList: PropTypes.arrayOf(PropTypes.any).isRequired,
	userPid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	push: PropTypes.func.isRequired
};

function mapStateToProps(state, { router }) {
	return {
		userPid: state.user.pid,
		msgList: getMsgData(state),
		push: router.push
	};
}

export default compose(
	withRouter,
	connect(mapStateToProps, null)
)(BcAlertList);
