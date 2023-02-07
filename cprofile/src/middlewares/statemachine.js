import {
	REGISTER_STATE_MACHINE,
	REMOVE_STATE_MACHINE,
	STATE_MACHINE_TRANSITION,
} from 'actions/ui/statemachine';
import { List } from 'immutable';

const statemachineMiddleware = store => next => action => {
	const state = store.getState();
	const validActions = List([
		REGISTER_STATE_MACHINE,
		REMOVE_STATE_MACHINE,
		STATE_MACHINE_TRANSITION,
	]);

	// send action first
	next(action);

	if (!validActions.includes(action.type)) return;

	const { key, event, extendedState } = action.payload;
	const machine =
		action.type === REGISTER_STATE_MACHINE
			? action.payload.machine
			: state.getIn(['ui', 'statemachine', key, 'machine']);
	const currentState =
		state.getIn(['ui', 'statemachine', key, 'value']) ||
		(machine && machine.initialStateValue);

	if (!machine || !currentState) return;

	// run onExist actions
	if (
		action.type === REMOVE_STATE_MACHINE ||
		action.type === STATE_MACHINE_TRANSITION
	) {
		const currentMachine = machine.getStateNode(currentState);
		// currentMachine = StateNode, has onEntry, onExit
		currentMachine.onExit.forEach(action => {
			action.extendedState = extendedState;
			store.dispatch(action);
		});
	}

	// run onEntry actions
	if (action.type === REGISTER_STATE_MACHINE) {
		machine.initialState.actions.forEach(action => {
			action.extendedState = extendedState;
			store.dispatch(action);
		});
	}
	if (action.type === STATE_MACHINE_TRANSITION) {
		const currentState =
			state.getIn(['ui', 'statemachine', key, 'value']) ||
			machine.initialStateValue;
		const nextMachine = machine.transition(
			currentState,
			event,
			extendedState,
			state
		);
		// nextMachine = State, has actions(onEntry) only
		nextMachine.actions.forEach(action => {
			action.extendedState = extendedState;
			store.dispatch(action);
		});
	}
};

export default statemachineMiddleware;
