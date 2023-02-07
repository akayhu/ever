import { combineReducers } from 'redux';
import bcMsgList from './bcMsgListReducer';
import bcMsgDetail from './bcMsgDetailReducer';
import acceptedCustNo from './acceptedCustNoReducer';
import readingJobNo from './readingJobNoReducer';
import sendMsg from './sendMsgReducer';

export default combineReducers({
	bcMsgList,
	bcMsgDetail,
	acceptedCustNo,
	readingJobNo,
	sendMsg
});
