import uuid from 'uuid/v4';

export const PUSH_SYS_MESSAGE = 'PUSH_SYS_MESSAGE';
export const pushSystemMessage = (
	content = '',
	level = 'info',
	autoDisapear = true
) => ({
	type: PUSH_SYS_MESSAGE,
	payload: {
		content,
		level,
		id: uuid(),
		autoDisapear,
	},
});

export const DEL_SYS_MESSAGE = 'DEL_SYS_MESSAGE';
export const delSystemMessage = id => ({
	type: DEL_SYS_MESSAGE,
	id,
});
