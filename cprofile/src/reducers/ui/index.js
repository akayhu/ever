import { combineReducers } from 'redux-immutable';
import FactoryReducer from './factory';
import LightboxReducer from './lightbox';
import MenubarReducer from './menubar';
import PrintReducer from './print';
import profileReducer from './profile';
import SystemMessageReducer from './systemMessage';
import StatemachineReducer from './statemachine';
import MobileDrawerReducer from './mobileDrawer';
import NoviceGuideReducer from './noviceGuide';
import ActivationGuideReducer from './activationGuide';
import ProfileDrawerReducer from './profileDrawer';
import BlocksListReducer from './blocksList';
import ReOrderReducer from './reorder';
import MobilePromptReducer from './mobilePrompt';
import SurveyReducer from './survey';
import PlusActivityReducer from './plusActivity';

export default combineReducers({
	factory: FactoryReducer,
	lightbox: LightboxReducer,
	menubar: MenubarReducer,
	print: PrintReducer,
	profile: profileReducer,
	ProfileDrawer: ProfileDrawerReducer,
	systemMessage: SystemMessageReducer,
	statemachine: StatemachineReducer,
	mobileDrawer: MobileDrawerReducer,
	noviceGuide: NoviceGuideReducer,
	activationGuide: ActivationGuideReducer,
	blocksList: BlocksListReducer,
	reorder: ReOrderReducer,
	mobilePrompt: MobilePromptReducer,
	survey: SurveyReducer,
	plusActivity: PlusActivityReducer,
});
