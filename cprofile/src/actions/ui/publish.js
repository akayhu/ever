export const START_PUBLISH_PROCESS = 'START_PUBLISH_PROCESS';
export const startPublishProcess = () => ({
	type: START_PUBLISH_PROCESS,
});

export const PUBLISH_RESULT_PROCESS = 'PUBLISH_RESULT';
export const publishResultProcess = params => ({
	type: PUBLISH_RESULT_PROCESS,
	params,
});
