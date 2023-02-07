import RSAA from 'redux-api-middleware/lib/RSAA';
import { isRSAA, validateRSAA } from 'utils/validation';
import { InvalidRSAA, RequestError } from 'redux-api-middleware/lib/errors';
import {
	normalizeTypeDescriptors,
	actionWith,
} from 'redux-api-middleware/lib/util';
// import { List } from 'immutable';

const apiMiddleware = ({ getState }) => next => action => {
	return !isRSAA(action)
		? next(action)
		: (async () => {
				// RSAAs 格式檢查，失敗會 dispatch error request FSA
				const validationErrors = validateRSAA(action);
				if (validationErrors.length) {
					const callAPI = action[RSAA];
					if (callAPI.types && Array.isArray(callAPI.types)) {
						let requestType = callAPI.types[0];
						if (requestType && requestType.type) {
							requestType = requestType.type;
						}
						next({
							type: requestType,
							payload: new InvalidRSAA(validationErrors),
							error: true,
						});
					}

					return;
				}

				// 是否需要 bailout 取消 action 發送
				let { bailout, types, endpoint, body, headers, options } = action[RSAA];
				const [requestType] = normalizeTypeDescriptors(types);
				try {
					if (
						(typeof bailout === 'boolean' && bailout) ||
						(typeof bailout === 'function' && bailout(getState()))
					) {
						return;
					}
				} catch (e) {
					return next(
						await actionWith(
							{
								...requestType,
								payload: new RequestError('[RSAA].bailout function failed'),
								error: true,
							},
							[action, getState()]
						)
					);
				}

				// 處理 [RSAA].endpoint function
				if (typeof endpoint === 'function') {
					try {
						endpoint = endpoint(getState());
					} catch (e) {
						return next(
							await actionWith(
								{
									...requestType,
									payload: new RequestError('[RSAA].endpoint function failed'),
									error: true,
								},
								[action, getState()]
							)
						);
					}
				}

				// 處理 [RSAA].body function
				if (typeof body === 'function') {
					try {
						body = body(getState());
					} catch (e) {
						return next(
							await actionWith(
								{
									...requestType,
									payload: new RequestError('[RSAA].body function failed'),
									error: true,
								},
								[action, getState()]
							)
						);
					}
				}

				// 處理 [RSAA].headers function
				if (typeof headers === 'function') {
					try {
						headers = headers(getState());
					} catch (e) {
						return next(
							await actionWith(
								{
									...requestType,
									payload: new RequestError('[RSAA].headers function failed'),
									error: true,
								},
								[action, getState()]
							)
						);
					}
				}

				// 處理 [RSAA].options function
				if (typeof options === 'function') {
					try {
						options = options(getState());
					} catch (e) {
						return next(
							await actionWith(
								{
									...requestType,
									payload: new RequestError('[RSAA].options function failed'),
									error: true,
								},
								[action, getState()]
							)
						);
					}
				}

				// 後面實作由 APIEpic 接手
				next({
					...requestType,
					payload: action[RSAA],
					processAPI: true,
					processMethod: action[RSAA].processMethod || 'every',
				});
		  })();
};

export { apiMiddleware };
