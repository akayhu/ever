export const CREATE_WARNING = 'CREATE_WARNING';
export const CLOSE_WARNING = 'CLOSE_WARNING';

export function createWarning(params) {
	return {
		type: CREATE_WARNING,
		desc: params.desc,
	};
}

export function closeWarning() {
	return {
		type: CLOSE_WARNING,
	};
}
