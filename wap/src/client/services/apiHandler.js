/*
* handle response string to JSON object
*/
export default function handleResponse(res) {
	try {
		return JSON.parse(res);
	} catch(err) {

		return res;
	}
	return res;
}