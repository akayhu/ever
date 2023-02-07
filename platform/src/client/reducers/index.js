import { combineReducers } from 'redux';
import connection from './connection';
import user from './user';
import alert from './alert';
import test from './test';
import bcCommunication from './bcCommunication';
import ccCommunication from './ccCommunication';
import bubbles from './bubbles';
import profile from './profile';
import history from './history';
import language from './language';
import navigation from './navigation';
import notification from './notification';

const rootReducer = combineReducers({
	bcCommunication,
	bcCommunication,
	navigation,
	user,
	test,
	profile,
	alert,
	language,
	history,
	notification
});

export default rootReducer;
