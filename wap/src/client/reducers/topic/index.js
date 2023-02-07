import { combineReducers } from 'redux';
import entities from './entities';
import func from './func';
import isError from './isError';
import isLoading from './isLoading';
import byFunc from './byFunc';
import allFunc from './allFunc';

export const initalState = 0;

export default combineReducers({
	func,
	allFunc,
	byFunc,
	entities,
	isError,
	isLoading
});