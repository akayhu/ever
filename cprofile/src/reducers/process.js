import { fromJS, Record, is } from 'immutable';
import uuid from 'uuid/v4';
import { PROCESSING_START, PROCESSING_END } from 'actions/process';

// [{ level: ...., key: ..... }]
export const createProcess = Record({
	level: 'global',
	key: uuid(),
});

export const initState = fromJS({
	processing: [], // 正在處理中的 process
	history: [], // process 處理紀錄
});

const processingStart = (state, action) => {
	const { key, level } = action;
	const model = createProcess({ key, level });
	return state.updateIn(['processing'], processes =>
		processes.filter(process => !is(process, model)).push(model)
	);
};

const processingEnd = (state, action) => {
	const { key, level } = action;
	const model = createProcess({ key, level });
	const nextState = state.updateIn(['processing'], processes =>
		processes.filter(process => !is(process, model))
	);
	if (is(nextState, state)) return state;
	return nextState.updateIn(['history'], processes => processes.push(model));
};

const ProcessReducer = (state = initState, action) => {
	switch (action.type) {
		case PROCESSING_START:
			return processingStart(state, action);
		case PROCESSING_END:
			return processingEnd(state, action);
		default:
			return state;
	}
};

export default ProcessReducer;
