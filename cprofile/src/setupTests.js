import configureStore from 'redux-mock-store';
import { Map, fromJS } from 'immutable';
import { EventEmitter } from 'events';

const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	clear: jest.fn(),
};

global.localStorage = localStorageMock;
global.mockStore = configureStore();

// for saga
global.actionTrigger = new EventEmitter();
global.dispatched = [];
global.mockIO = state => ({
	dispatch: action => global.dispatched.push(action),
	getState: () => fromJS(state) || Map(),
	subscribe: callback => {
		global.actionTrigger.on('action', callback);
		return () => global.actionTrigger.removeListener('action', callback);
	},
});
