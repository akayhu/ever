import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import LogRocket from 'logrocket';
import { apiMiddleware } from './middlewares/processAPI';
import processMiddleware from './middlewares/process';
import systemMessageMiddleware from './middlewares/systemMessage';
import statemachineMiddleware from './middlewares/statemachine';
import rootReducer from './reducers';
import rootEpic, { epic$ } from './epics';
import rootSaga from './sagas';
import { RECIEVE_GRAPHQL_QUERY } from 'actions/graphql';
import { RECIEVE_USERNAME, UPDATE_USER_DATA } from 'actions/user';
import { isValidStage } from 'utils/validation';
import {
	RECIEVE_FETCH_PROFILE_BASIC,
	RECIEVE_UPDATE_PROFILE_BASIC,
} from 'actions/blocks/basic';
import {
	RECIEVE_BLOCK_DATA,
	BLOCK_DATA_UPDATE_PROCESS_START,
} from 'actions/blocks';
import {
	CREATE_API_REQUEST_EPIC,
	BYPASS_AND_PROCESS_BY_API_REQUEST_EPIC,
	DELETE_API_REQUEST_EPIC,
} from 'actions/processAPI';
import { fromJS } from 'immutable';

const sagaMiddleware = createSagaMiddleware();
const epicMiddleware = createEpicMiddleware(rootEpic, {
	dependencies: {
		epicLoader$: epic$,
	},
});
const reduxDevToolOptions = {
	maxAge: 1000,
	actionsBlacklist: ['@@process-api-middleware/'],
};

const logRocketOptions = {
	// 消除指定的 state
	stateSanitizer: state => {
		const getConfig = (state, blockType) => {
			if (!state || !blockType) return;
			return state
				.get('config')
				.find(block => block.get('blockType') === blockType);
		};
		const basicKey =
			(getConfig(state, 'basic') && getConfig(state, 'basic').get('uniKey')) ||
			'basic';
		return state
			.deleteIn(['user', 'userName'])
			.deleteIn(['user', 'data', 'userName'])
			.updateIn(
				['data', basicKey],
				item => item && item.set('userName', undefined)
			);
	},
	// 消除指定 action
	actionSanitizer: action => {
		const ignoreActions = [
			{
				type: CREATE_API_REQUEST_EPIC,
				ignoreAll: true,
			},
			{
				type: BYPASS_AND_PROCESS_BY_API_REQUEST_EPIC,
				ignoreAll: true,
			},
			{
				type: DELETE_API_REQUEST_EPIC,
				ignoreAll: true,
			},
			{
				type: [
					RECIEVE_FETCH_PROFILE_BASIC,
					RECIEVE_UPDATE_PROFILE_BASIC,
					RECIEVE_USERNAME,
					RECIEVE_BLOCK_DATA,
					UPDATE_USER_DATA,
				],
				ignoreAll: false,
				handler: action =>
					fromJS(action)
						.deleteIn(['payload', 'userName'])
						.toJS(),
			},
			{
				type: RECIEVE_GRAPHQL_QUERY,
				ignoreAll: false,
				handler: action =>
					fromJS(action)
						.deleteIn(['payload', 'Profile', 'basic', 'userName'])
						.toJS(),
			},
			{
				type: BLOCK_DATA_UPDATE_PROCESS_START,
				ignoreAll: false,
				handler: action =>
					fromJS(action)
						.updateIn(['payload', 'feild'], name =>
							name === 'userName' ? undefined : name
						)
						.toJS(),
			},
		];

		for (let i = 0; i < ignoreActions.length; ++i) {
			const setting = ignoreActions[i];
			if (
				Array.isArray(setting.type) &&
				setting.type.indexOf(action.type) === -1
			)
				continue;
			if (!Array.isArray(setting.type) && setting.type !== action.type)
				continue;
			return setting.ignoreAll ? null : setting.handler(action);
		}
		return action;
	},
};

// local, lab 環境才開啟 redux devtool
// middlewares 執行順序由上到下
const getEnhancer = (...middlewares) => {
	if (isValidStage(['local', 'lab'])) {
		return composeWithDevTools(reduxDevToolOptions)(
			applyMiddleware(...middlewares)
		);
	}
	return applyMiddleware(...middlewares);
};

const store = createStore(
	rootReducer,
	getEnhancer(
		statemachineMiddleware,
		apiMiddleware,
		sagaMiddleware,
		epicMiddleware,
		processMiddleware,
		systemMessageMiddleware,
		LogRocket.reduxMiddleware(logRocketOptions)
	)
);

sagaMiddleware.run(rootSaga);

export default store;
