export const mockResponse = (
	body = {},
	status = 200,
	customOptions = {},
	delay = 3000
) => {
	const fakeResponse = new Response(JSON.stringify(body), {
		headers: { 'Content-Type': 'application/json' },
		status,
		...customOptions,
	});
	return new Promise(resolve =>
		setTimeout(resolve.bind(this, fakeResponse), delay)
	);
};
