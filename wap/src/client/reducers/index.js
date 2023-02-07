import { combineReducers } from 'redux';
import activityReducer from './activity';
import accuseReducer from './accuse';
import advertisingReducer from './advertising';
import profileReducer from './profile';
import chronicleReducer from './chronicle';
import endorseReducer from './endorse';
import connectionReducer from './connection';
import accessRecordReducer from './accessRecord';
import socialReducer from './social';
import groupReducer from './group';
import privacyReducer from './privacy';
import searchReducer from './search';
import globalReducer from './global';
import bcCommunicationReducer from './bcCommunication';
import messageReducer from './message';
import notificationReducer from './notification';
import subscribeFunctionReducer from './subscribeFunction';
import functionStatisticReducer from './functionStatistic';
import topicReducer from './topic';
import testReducer from './test';
import channelReducer from './channel';
import elogReducer from './elog';
import ssrStatusCodeReducer from './ssrStatusCode';
import {reducers as CPlatformReducers} from 'c_platform';

const navigationReducer = CPlatformReducers.navigation.default;
const	userReducer = CPlatformReducers.user.default;
const	alertReducer = CPlatformReducers.alert.default;
const	historyReducer = CPlatformReducers.history.default;
const	languageReducer = CPlatformReducers.language.default;
// duplicate
const platformTestReducer = CPlatformReducers.test.default;
const metaDataReducer = CPlatformReducers.metadata.default;

const mixedReducer = (...reducers) => (state, action) =>
	reducers.reduce(
		(newState, reducer) => reducer(newState, action),
		state
	);

const appReducer = combineReducers({
	activity: activityReducer,
	accuse: accuseReducer,
	advertising: advertisingReducer,
	profile: profileReducer,
	endorse: endorseReducer,
	connection: connectionReducer,
	accessRecord: accessRecordReducer,
	social: socialReducer,
	search: searchReducer,
	privacy: privacyReducer,
	bcCommunication: bcCommunicationReducer,
	message: messageReducer,
	subscribeFunction: subscribeFunctionReducer,
	functionStatistic: functionStatisticReducer,
	topic: topicReducer,
	test: mixedReducer(testReducer, platformTestReducer),
	chronicle: chronicleReducer,
	global: globalReducer,
	group: groupReducer,
	notification: notificationReducer,
	channel: channelReducer,
	user: userReducer,
	// error : errorReducer,
	navigation: navigationReducer,
	alert: alertReducer,
	history: historyReducer,
	language: languageReducer,
	elog: elogReducer,
	metaData: metaDataReducer,
	ssrStatusCode: ssrStatusCodeReducer
	// ...topReducers
});

const rootReducer = (state, action) => {
	if (action.type === 'CLEAR_STORE') {
		state = undefined;
	}
	return appReducer(state, action);
};

export default rootReducer;
