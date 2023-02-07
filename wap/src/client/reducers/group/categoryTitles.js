import { combineReducers } from 'redux';
import {
  dataList,
  total,
  loading,
  error} from './unitReducers';

const categoryTitles = combineReducers({
	dataList: dataList('categoryTitles'),
	total: total('categoryTitles'),
	loading: loading('categoryTitles'),
	error: error('categoryTitles')
});

export default categoryTitles;
