import { combineReducers } from 'redux-immutable';
import UserReducer from './user';
import BlocksListReducer from './blocksList';
import UIReducer from './ui';
import TemplateReducer from './templates';
import ConfigReducer from './config';
import DataReducer from './data';
import ConnectorReducer from './connector';
import ImportReducer from './import';
import ProfilePollReducer from './profile';
import CollectionReducer from './collection';
import ProcessReducer from './process';
import CategoryReducer from './category';
import ShowEditorServiceLightBoxReducer from './serviceInfo';
import PublishReducer from './publish';

const rootReducer = combineReducers({
	blocksList: BlocksListReducer,
	user: UserReducer,
	templates: TemplateReducer,
	ui: UIReducer,
	config: ConfigReducer,
	data: DataReducer,
	connector: ConnectorReducer,
	import: ImportReducer,
	profile: ProfilePollReducer,
	collection: CollectionReducer,
	process: ProcessReducer,
	category: CategoryReducer,
	serviceInfo: ShowEditorServiceLightBoxReducer,
	publish: PublishReducer,
});
export default rootReducer;
