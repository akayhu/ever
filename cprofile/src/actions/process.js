import uuid from 'uuid/v4';

export const PROCESSING_START = 'PROCESSING_START';
export const processingStart = (key = uuid(), level = 'global') => ({
	type: PROCESSING_START,
	level,
	key,
});

export const PROCESSING_END = 'PROCESSING_END';
export const processingEnd = (key = uuid(), level = 'global') => ({
	type: PROCESSING_END,
	level,
	key,
});
