import { is } from 'immutable';
import { initState, createProcess } from 'reducers/process';

// 確認某個 key 的非同步處理是否已經完成、做過了
export const checkProcessIsDone = (
	process = initState,
	key = '',
	level = 'global'
) =>
	process
		.get('history')
		.findIndex(process => is(process, createProcess({ key, level }))) !== -1;

// 確認某個 key 的非同步處理是否正在執行
export const checkProcessIsLoading = (
	process = initState,
	key = '',
	level = 'global'
) =>
	process
		.get('processing')
		.findIndex(process => is(process, createProcess({ key, level }))) !== -1;

// 是否有任何執行中非同步處理
export const hasAnyProcessing = (process = initState) =>
	process.get('processing').size > 0;
