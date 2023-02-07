/* eslint-disable */
import {
	REGISTER_STATE_MACHINE,
	registerStateMachine,
	REMOVE_STATE_MACHINE,
	removeStateMachine,
	STATE_MACHINE_TRANSITION,
	stateMachineTransition,
} from 'actions/ui/statemachine';

describe('statemachine actions', () => {
	it('component mount 時註冊新的狀態機', () => {
		const key = 'publish';
		const machine = {
			key: 'collection',
			initial: 'loading',
			states: {
				loading: {
					on: {
						SHOW_LIST: 'list',
						SHOW_EMPTY: 'empty',
						ERROR: 'error',
					},
				},
				list: {
					on: {
						REFRESH: 'loading',
					},
				},
				empty: {
					on: {
						REFRESH: 'loading',
					},
				},
				error: {
					on: {
						REFRESH: 'loading',
					},
				},
			},
		};
		const extendedState = '';
		const expectedAction = {
			type: REGISTER_STATE_MACHINE,
			payload: {
				key,
				machine,
				extendedState,
			},
		};
		expect(registerStateMachine(key, machine, extendedState)).toEqual(
			expectedAction
		);
	});

	it('component unmount 時移除狀態機', () => {
		const key = 'privacy';
		const extendedState = {
			key: 'collection',
			initial: 'loading',
			states: {
				loading: {
					on: {
						SHOW_LIST: 'list',
						SHOW_EMPTY: 'empty',
						ERROR: 'error',
					},
				},
				list: {
					on: {
						REFRESH: 'loading',
					},
				},
				empty: {
					on: {
						REFRESH: 'loading',
					},
				},
				error: {
					on: {
						REFRESH: 'loading',
					},
				},
			},
		};
		const expectedAction = {
			type: REMOVE_STATE_MACHINE,
			payload: {
				key,
				extendedState,
			},
		};
		expect(removeStateMachine(key, extendedState)).toEqual(expectedAction);
	});

	it('執行狀態切換', () => {
		const key = 'publish';
		const event = 'START_PUBLISH';
		const extendedState = {
			key: 'collection',
			initial: 'loading',
			states: {
				loading: {
					on: {
						SHOW_LIST: 'list',
						SHOW_EMPTY: 'empty',
						ERROR: 'error',
					},
				},
				list: {
					on: {
						REFRESH: 'loading',
					},
				},
				empty: {
					on: {
						REFRESH: 'loading',
					},
				},
				error: {
					on: {
						REFRESH: 'loading',
					},
				},
			},
		};
		const expectedAction = {
			type: STATE_MACHINE_TRANSITION,
			payload: {
				key,
				event,
				extendedState,
			},
		};
		expect(stateMachineTransition(key, event, extendedState)).toEqual(
			expectedAction
		);
	});
});
