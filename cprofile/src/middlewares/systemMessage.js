import { fromJS } from 'immutable';
import { PUSH_SYS_MESSAGE } from 'actions/ui/systemMessage';

// 檢查全局提示 level
const systemMessageMiddleware = store => next => action => {
	const validLevels = fromJS([
		'info',
		'loading',
		'success',
		'error',
		'warning',
	]);

	if (
		action.type === PUSH_SYS_MESSAGE &&
		!validLevels.includes(action.payload.level)
	) {
		console.error(
			'Invalid system message level. Accept info, success, error, loading.',
			action.payload.level
		);
		return;
	}
	return next(action);
};

export default systemMessageMiddleware;
