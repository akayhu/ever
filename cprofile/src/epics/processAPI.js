import { epic$ } from './index';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { ApiError } from 'redux-api-middleware/lib/errors';
import {
	getJSON,
	normalizeTypeDescriptors,
} from 'redux-api-middleware/lib/util';
import { Map } from 'immutable';
import {
	createAPIRequestEpic,
	bypassAndProcessByEpic,
} from '../actions/processAPI';

class APIEpicSubject {
	constructor(action$, store) {
		// 已訂閱此 Subject 的 Request Epic 清單
		this.epicObservers = new Map({});
		// 根據不同 processMethod 建立訂閱某 API request action 的 epic
		this.epicFactoryMap = {
			takeLatest: requestAction => (action$, store) =>
				action$
					.ofType(requestAction.type)
					.switchMap(action => this.fetchAPI(action))
					.mergeAll(),
			every: requestAction => (action$, store) =>
				action$
					.ofType(requestAction.type)
					.mergeMap(action => this.fetchAPI(action))
					.mergeAll(),
			debounce: requestAction => (action$, store) =>
				action$
					.ofType(requestAction.type)
					.debounceTime(500)
					.mergeMap(action => this.fetchAPI(action))
					.mergeAll(),
		};
	}
	/**
	 * 動態新增一個 epic 動態訂閱 action stream
	 */
	addEpic = requestAction => {
		if (!requestAction || !requestAction.type || !requestAction.processMethod)
			return;
		if (this.hasEpic(requestAction)) return;
		const newEpic =
			requestAction.processMethod instanceof Function
				? requestAction.processMethod
				: this.epicFactoryMap[requestAction.processMethod](requestAction);

		// 新增一個訂閱到清單中
		this.epicObservers = this.epicObservers.set(requestAction.type, newEpic);
		// 動態新增一個 epic 動態訂閱 action stream
		epic$.next(newEpic);
		return this;
	};
	/**
	 * 檢查某個 type 的 epic 是否存在
	 */
	hasEpic = requestAction => {
		if (!requestAction || !requestAction.type) return;
		return this.epicObservers.has(requestAction.type);
	};
	/**
	 * 取得某個 type 的 epic
	 */
	getEpic = requestAction => {
		if (!requestAction || !requestAction.type) return;
		return this.epicObservers.get(requestAction.type);
	};
	/**
	 * 從訂閱清單移除指定 type 的 epic
	 */
	removeEpic = requestAction => {
		if (!requestAction || !requestAction.type) return;
		this.epicObservers.get(requestAction.type).unsubscribe();
		this.epicObservers.delete(requestAction.type);
	};
	/**
	 * 建立一個 cancellable 的 fetch observable 處理 API
	 * 1. 成功 => [successType]
	 * 2. 失敗 => [failureAction]
	 * 3. 未登入而失敗 => [logoutAction, failureAction]
	 *
	 * 後續透過 of() 轉成 Observable 依序發送 action
	 */
	fetchAPI = requestAction =>
		new Observable(observer => {
			/* 
        關於現有 cancel fetch 的做法
        1. Promise.race (http://louiszhai.github.io/2016/11/02/fetch/)
        2. AbortController (https://developers.google.com/web/updates/2017/09/abortable-fetch)
        3. AbortController Polyfill (https://www.npmjs.com/package/abortcontroller-polyfill)
      */
			const { AbortController } = window;
			const controller = new AbortController();
			const doFetch = requestAction.payload.fetch || global.fetch;
			const processAPI = doFetch(requestAction.payload.endpoint, {
				method: requestAction.payload.method,
				credentials: requestAction.payload.credentials,
				options: { ...requestAction.payload.options },
				headers: requestAction.payload.headers || {},
				body: requestAction.payload.body || undefined,
				signal: controller.signal,
			});
			const source = Promise.all([processAPI, requestAction.payload]).then(
				([response, param]) =>
					getJSON(response).then(json => {
						if (!json) json = {};
						const types = normalizeTypeDescriptors(param.types);
						const successType = types[1];
						const failureType = types[2];
						// API Request 成功，且 status 落在 200 範圍內、parse body 正常，發 2nd 位置的 action
						if (response.ok && !json.error) {
							const successAction = {
								...successType,
								payload: json.hasOwnProperty('response') ? json.response : json,
							};
							const nextActions = param.next
								? [].concat(param.next(response, successAction.payload))
								: [];
							return [
								successAction,
								...nextActions.filter(
									action => typeof action === 'object' && action.type
								),
							].filter(action => action);
						} else {
							const failureAction = {
								...failureType,
								payload: new ApiError(
									response.status,
									response.statusText,
									json
								),
								error: true,
							};
							// 有任何錯誤都發 types 3rd 位置的 action (401 登出由各 action creator 自己處理)
							const errorActions = param.error
								? [].concat(param.error(response, json))
								: [];
							return [
								failureAction,
								...errorActions.filter(
									action => typeof action === 'object' && action.type
								),
							].filter(action => action);
						}
					})
			);

			// console.log(`[APIEpicSubject][${requestAction.type}] establish`);
			const subscription = fromPromise(source).subscribe(resultActions => {
				// console.log(`[APIEpicSubject][${requestAction.type}] process action: `, resultActions);
				// 將 API response 處理結果傳給 action stream
				observer.next(of(...resultActions));
			});
			return {
				unsubscribe() {
					// console.log(`[APIEpicSubject][${requestAction.type}] unsubscribe`);
					controller.abort(); // 取消 fetch request 發送
					subscription.unsubscribe(); // 取消訂閱
				},
			};
		});
}

/**
 * 主要處理每個 RSAA request 的方法
 * @param {*} action$
 * @param {*} param1
 */
export const processAPIEpic = (action$, store, { epicLoader$ }) =>
	action$
		.filter(action => action.processAPI)
		.do(() => {
			// 初始化建立 APIEpicSubject
			if (!(global.APIEpicSubject instanceof APIEpicSubject)) {
				global.APIEpicSubject = new APIEpicSubject(action$, store.getState());
				// return console.log('初始化 APIEpicSubject 成功.', global.APIEpicSubject);
			}
			// console.log('已初始化過 APIEpicSubject.', global.APIEpicSubject);
		})
		.mergeMap(requestAction => {
			const beforeActions = requestAction.payload.before
				? [].concat(requestAction.payload.before())
				: [];

			// 有建立過 request action 的 epic，忽略不處理
			if (global.APIEpicSubject.hasEpic(requestAction)) {
				return of(...beforeActions, bypassAndProcessByEpic(requestAction));
			}

			return (
				of(...beforeActions, requestAction)
					// 沒有建立過 request action 的 epic，新建一個 epic
					.do(requestAction => global.APIEpicSubject.addEpic(requestAction))
					// 多送一次 request action 處理第一次的 API request
					.mergeMap(requestAction =>
						of(createAPIRequestEpic(requestAction), requestAction)
					)
			);
		});
