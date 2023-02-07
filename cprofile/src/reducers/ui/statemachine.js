import { Map, Record, fromJS } from 'immutable';
import {
	REGISTER_STATE_MACHINE,
	REMOVE_STATE_MACHINE,
	STATE_MACHINE_TRANSITION,
} from 'actions/ui/statemachine';

/**
 * 保存當前 state 狀態
 * ex: { preview: { value: 'loading', machine: <machine>, extendedState: <extendedState> }
 */
export const initState = Map();

const createStatemachine = Record({
	value: '',
	machine: Map(),
	extendedState: Map(),
});

const statemachine = (state = initState, action) => {
	if (!action.payload || !action.payload.key) {
		return state;
	}
	switch (action.type) {
		case REGISTER_STATE_MACHINE: {
			const { key, machine, extendedState } = action.payload;
			if (!action.payload.machine) return state;

			const value = machine.initialState.value;
			return state.set(
				key,
				createStatemachine({
					value,
					machine,
					extendedState: fromJS(extendedState || {}),
				})
			);
		}

		case REMOVE_STATE_MACHINE: {
			const { key } = action.payload;
			return state.delete(key);
		}

		case STATE_MACHINE_TRANSITION: {
			const { key, event, extendedState } = action.payload;
			const machine = state.getIn([key, 'machine']);
			if (!machine) return state;

			const newState = machine.transition(
				state.getIn([key, 'value']),
				event,
				extendedState
			).value;
			return state
				.setIn([key, 'value'], newState)
				.updateIn([key, 'extendedState'], prevExtendedState =>
					extendedState && typeof extendedState === 'object'
						? prevExtendedState.merge(extendedState)
						: prevExtendedState
				);
		}

		default:
			return state;
	}
};

export default statemachine;
