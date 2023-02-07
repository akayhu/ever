import { combineReducers } from 'redux';
import {createCategoryList} from './unitReducers';

const allGroup = combineReducers({
	knowAndTech: createCategoryList('knowAndTech'),
	lifestyle: createCategoryList('lifestyle'),
	healthAndLeisure: createCategoryList('healthAndLeisure'),
	artAndDesign: createCategoryList('artAndDesign')
});

export default allGroup;
