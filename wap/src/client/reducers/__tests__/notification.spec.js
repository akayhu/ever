/* eslint-disable */
import * as notifiActions from 'src/client/actions/notification';
import * as pusherActions from 'c_platform/lib/client/actions/pusher';
import reducer from 'src/client/reducers/notification';

describe('reducers / notification', () => {
    beforeEach(() => {
        global.generateDataList = (num = 10) => {
            let list = [];
            for(let i = 0; i < num; i++){
                list.push({ "message": `mockMsg No.${i}` });
            }
            return list;
        };
        global.generateCursor = () => {
            const chars = '0123456789abcdef';
            let uuid = [8, 4, 4, 12];
            return uuid
                .map(length => {
                    let str = '';
                    for(let i = 0; i < length; i++){
                        let rIdx = Math.floor(Math.random()*chars.length);
                        str += chars[rIdx];
                    }
                    return str;
                }).join('-');
        }
        global.mockStore = (type = 'init') => {
            const initState = {
                dataList: [],
                cursor: null,
                hasNext: false,
                isLoading: false,
                error: false,
            };
            const fakeState = {
                dataList: generateDataList(20),
                cursor: generateCursor(),
                hasNext: true,
                isLoading: false,
                error: false,
            }
            switch(type){
                case 'fake':
                    return fakeState;
                case 'error':
                    return Object.assign({}, initState, { error: true });
                case 'reachEnd':
                    return Object.assign({}, fakeState, { hasNext: false });
                case 'loading':
                    return Object.assign({}, fakeState, { isLoading: true });
                case 'init':
                default:
                    return initState;
            }
        };
    })  
    it('should return initialState', () => {
        expect(reducer(undefined, {})).toEqual(mockStore());
    });
    it('?????? LOADING_NOTIFICATION??????????????? isLoading???error', () => {
        const action = { type: notifiActions.LOADING_NOTIFICATION };
        expect(reducer(mockStore(), action).isLoading).toBe(true);
    })
    it('?????? CALL_API ????????? GET_NOTIFICATION_LIST??????????????? dataList???cursor???hasNext???isLoading', () => {
        const mockCursor = generateCursor();
        const mockDataList = generateDataList(10);
        const state = mockStore();
        const action = { 
            type: notifiActions.GET_NOTIFICATION_LIST,
            response: {
                response: {
                    cursor: mockCursor,
                    hasNext: true,
                    dataList: mockDataList,
                }
            },
        };
        const expectState = {
            ...state,
            dataList: mockDataList,
            cursor: mockCursor,
            hasNext: true,
        };
        expect(reducer(state, action)).toEqual(expectState);
    })
    it('?????? CALL_API ????????? GET_NOTIFICATION_LIST??????????????? error???isLoading', () => {
        const state = mockStore();
        const action = { 
            type: notifiActions.GET_NOTIFICATION_LIST,
            response: {
                error: {}
            },
        };
        const expectState = {
            ...state,
            isLoading: false,
            error: true,
        };
        expect(reducer(state, action)).toEqual(expectState);
    })
    it('?????? category ??? notification ??? PUSHER_MESSAGE_RECEIVE???????????????????????? dataList ?????????  ', () => {
        const newNotify = { message: 'new notification' };
        const state = mockStore('fake');
        const action = { 
            type: pusherActions.PUSHER_MESSAGE_RECEIVED,
            category: 'notification',
            msg: newNotify
        };
        expect(reducer(state, action).dataList[0]).toEqual(newNotify);
    })
    it('?????? category ?????? notification ??? PUSHER_MESSAGE_RECEIVE???????????????', () => {
        const state = mockStore('fake');
        const action = { 
            type: pusherActions.PUSHER_MESSAGE_RECEIVE,
            category: 'message',
            msg: { message: 'new notification' }
        };
        expect(reducer(state, action).dataList).toHaveLength(state.dataList.length);
        expect(reducer(state, action).dataList).toEqual(expect.arrayContaining(state.dataList));
    })
    it('??? hasNext ??? false ???????????? LOADING_NOTIFICATION ???????????????', () => {
        const state = mockStore('reachEnd');
        const action = { type: notifiActions.LOADING_NOTIFICATION };
        expect(reducer(state, action)).toEqual(state);
    })
    it('??? hasNext ??? false ???????????? GET_NOTIFICATION_LIST ???????????????', () => {
        const state = mockStore('reachEnd');
        const action = { type: notifiActions.GET_NOTIFICATION_LIST };
        expect(reducer(state, action)).toEqual(state);
    })
    it('??? isLoading ??? true ???????????? LOADING_NOTIFICATION ????????????', () => {
        const state = mockStore('loading');
        const action = { type: notifiActions.LOADING_NOTIFICATION };
        expect(reducer(state, action)).toEqual(state);
    })
    it('??? error ??? true????????? LOADING_NOTIFICATION ?????? error ??? false', () => {
        const state = mockStore('error');
        const action = { type: notifiActions.LOADING_NOTIFICATION };
        const expectState = {
            ...state,
            isLoading: true,
            error: false,
        };
        expect(reducer(state, action)).toEqual(expectState);
    })
    it('??? error ??? true??????????????????????????????????????? dataList???cursor???hasNext???isLoading???error', () => {
        const state = mockStore('error');
        const mockCursor = generateCursor();
        const mockDataList = generateDataList(10);
        return Promise.resolve(reducer(state, { 
                type: notifiActions.LOADING_NOTIFICATION
            }))
            .then(nextState => {
                expect(nextState).toEqual({
                    ...state,
                    isLoading: true,
                    error: false,
                });
                return reducer(nextState, { 
                    type: notifiActions.GET_NOTIFICATION_LIST,
                    response: {
                        response: {
                            dataList: mockDataList,
                            cursor: mockCursor,
                            hasNext: true,
                        }
                    },
                });
            })
            .then(nextState => {
                expect(nextState).toEqual({
                    ...state,
                    dataList: mockDataList,
                    cursor: mockCursor,
                    hasNext: true,
                    error: false,
                });
            });
    })
});