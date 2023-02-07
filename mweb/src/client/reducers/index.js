import { combineReducers } from 'redux';
// from other
import { reducers as CPlatformReducers } from 'c_platform';
import activeActivity from './activeActivity';
import layerActivity from './layerActivity';
import warning from './warning';
import main from './main';
import entities from './entities';
import group from './group';
import channel from './channel';
import profile from './profile';
import topic from './topic';
import collection from './collection';
import privacy from './privacy';
import bubble from './bubble';
import search from './search';
import notification from './notification';
import ssrStatusCode from './ssrStatusCode';

const user = CPlatformReducers.user.default;
const alert = CPlatformReducers.alert.default;
const	history = CPlatformReducers.history.default;
const	language = CPlatformReducers.language.default;
const metaData = CPlatformReducers.metadata.default;

const rootReducer = combineReducers({
	activeActivity,
	layerActivity,
	warning,
	notification,
	user,
	privacy,
	main,
	group,
	channel,
	entities,
	profile,
	topic,
	collection,
	bubble,
	alert,
	history,
	language,
	search,
	metaData,
	ssrStatusCode,
});

export default rootReducer;
