// component mount 時註冊新的狀態機
export const REGISTER_STATE_MACHINE = 'REGISTER_STATE_MACHINE';
export const registerStateMachine = (key, machine, extendedState) => ({
	type: REGISTER_STATE_MACHINE,
	payload: {
		key,
		machine,
		extendedState,
	},
});

// component unmount 時移除狀態機
export const REMOVE_STATE_MACHINE = 'REMOVE_STATE_MACHINE';
export const removeStateMachine = (key, extendedState) => ({
	type: REMOVE_STATE_MACHINE,
	payload: {
		key,
		extendedState,
	},
});

// 執行狀態切換
export const STATE_MACHINE_TRANSITION = 'STATE_MACHINE_TRANSITION';
export const stateMachineTransition = (key, event, extendedState) => ({
	type: STATE_MACHINE_TRANSITION,
	payload: {
		key,
		event,
		extendedState,
	},
});
