export const CHANGE_SSR_STATUS = 'CHANGE_SSR_STATUS';
export function changeSSRStatus(statusCode) {
	return {
		type: CHANGE_SSR_STATUS,
		statusCode,
	};
}
