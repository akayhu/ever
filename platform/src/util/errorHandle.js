const isServerError = (res = {}) => res.hasOwnProperty('errorCode');
const isWrong = (obj = {}) => Object.keys(obj).includes('error') || Object.keys(obj).includes('warning');

export default function errorHandle(res) {
	if (isServerError(res) || isWrong(res)) return true;
	return false;
}
