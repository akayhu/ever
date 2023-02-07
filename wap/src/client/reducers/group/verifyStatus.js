import {
	CLEAR_DATA,
	TRIGGER_SORT,
	CHECK_ACTIVITY,
	ALERT_CHECK_LIMIT,
	CLOSE_ACTIVITY_ALERT,
	DELETING_SINGLE_ACTIVITIES,
	DELETING_BATCH_ACTIVITIES,
	DELETE_ACTIVITY_SUCCESS,
	DELETE_ACTIVITY_ERROR
	} from '../../actions/group';

export const initListState = {
	batchLoading: false,
	msg: '',
	checkedNumber: 0,
	checkedStack: [],
	alert: false,
	sortField: undefined,
	sortOrder: -1,
};

const verifyStatus = (state = initListState, action) => {
	try{
		if (action.category !== 'groupActivityForCheck')
			return state;

		switch (action.type) {
			case CLEAR_DATA: {
				return initListState;
			}
			case TRIGGER_SORT: {
				return {...state,
					sortField: action.sortField,
					sortOrder: action.sortOrder
				};
			}
			case CHECK_ACTIVITY: {
				const { checkedNumber, checkedStack } = state;
				const { aid } = action;
				const aidIsExist = checkedStack.indexOf(aid) !== -1;
				const newCheckedNumber = aidIsExist ? checkedNumber - 1 : checkedNumber + 1;

				return {...state,
					msg: newCheckedNumber > 0 ? `已勾選${newCheckedNumber}筆` : '',
					checkedNumber: newCheckedNumber,
					checkedStack: aidIsExist
						? checkedStack.filter(item => item !== aid)
						: [...checkedStack, aid]
				};
			}
			case ALERT_CHECK_LIMIT: {
				return {...state,
					msg: '最多只能勾選10筆',
					alert: true
				};
			}
			case CLOSE_ACTIVITY_ALERT: {
				return {...state,
					msg: '',
					alert: false
				};
			}
			case DELETING_SINGLE_ACTIVITIES: {
				return {...state,
					msg: ''
				};
			}
			case DELETING_BATCH_ACTIVITIES: {
				return {...state,
					msg: '',
					batchLoading: true
				};
			}
			case DELETE_ACTIVITY_SUCCESS: {
				const { aidList } = action;
				const { batchLoading, checkedStack } = state;
				const newCheckedStack = batchLoading ? [] : checkedStack.filter(item => item !== aidList);
				const newCheckedNumber = newCheckedStack.length;
				const newMsg = batchLoading
					? '批次處理完成'
					: (newCheckedNumber > 0) ? `已勾選${newCheckedNumber}筆` : '';
				return {...state,
					batchLoading: false,
					msg: newMsg,
					checkedStack: newCheckedStack,
					checkedNumber: newCheckedNumber
				};
			}
			case DELETE_ACTIVITY_ERROR: {
				if (state.batchLoading === true) {
					return {...state,
						batchLoading: false,
						msg: '批次處理失敗'
					};
				}
				return state;
			}
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};

export default verifyStatus;
