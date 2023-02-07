const isServerError = (res = {}) => res.hasOwnProperty('errorCode');
const isWrong = (res = {}) => res.hasOwnProperty('warning');

export default function errorHandle(res) {

	if (isServerError(res) || isWrong(res.response)) return true;
	return false;
}
