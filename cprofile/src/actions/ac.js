import { RSAA } from 'redux-api-middleware';
import DOMPurify from 'dompurify';
import generalConfig from 'config/general';

export const REQUEST_AC = 'REQUEST_AC';
export const RECIEVE_AC = 'RECIEVE_AC';
export const FAILURE_AC = 'FAILURE_AC';
export const requestAC = (param, cb) => ({
	[RSAA]: {
		endpoint: `${generalConfig.api}/autocomplete/${
			param.autoCompleteName
		}/?keyword=${encodeURIComponent(
			DOMPurify.sanitize(param.value, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
		)}`,
		types: [REQUEST_AC, RECIEVE_AC, FAILURE_AC],
		method: 'get',
		processMethod: 'debounce',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		next: (response, json) => {
			cb(json);
		},
	},
});
