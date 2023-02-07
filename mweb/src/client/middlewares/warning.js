import { CREATE_WARNING } from '../actions/warning';

export default function warning() {
	return store => next => (action) => {
		if (action.response && action.response.response && action.response.response.warning) {
			// console.log(action);
			return next({
				type: CREATE_WARNING,
				desc: action.response.response.warning.desc,
			});
		}
		return next(action);
	};
}
