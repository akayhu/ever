import { canUseDOM } from 'exenv';
import lodash from 'lodash';
 
/*export const elog = (track, ext) => {
    if (canUseDOM && window._elog) {
        window._elog.push({
            web: 'plus',
            track: [track],
            ext: ext
        });
    }
}*/

const elogActionMap = {
    "LIKE_THIS_ACTIVITY": { track: 'clickActivity', event: 'cool'},
    "COLLECT_THIS_ACTIVITY": { track: 'clickActivity', event: 'collect'},
    "CREATE_COMMENT": { track: 'clickActivity', event: 'comment'},
    "IGNORE_ACTIVITY": { track: 'clickActivity', event: 'rejectActivity'},
    "NOT_INTERESTED_SOMEBODY": { track: 'clickActivity', event: 'rejectPeople'},

    "INVITE": { track: 'viewPeopleList', event: 'connect'},
    "GET_NAMECARD": { track: 'viewPeopleList', event: 'clickPic'},
    "ELOG_SEND_MESSAGE": { track: 'viewPeopleList', event: 'message'},
    "SUBSCRIBE_SOMEBODY": { track: 'viewPeopleList', event: 'follow'},

    "APPLY_JOIN_GROUP": { track: 'clickGroup', event: 'join'},

    "SUBSCRIBE_MEDIA": { track: 'clickChannel', event: 'follow'},
    "UN_SUBSCRIBE_MEDIA": { track: 'clickChannel', event: 'unfullow'},
}

const handlerMap = {
    "clickActivity": (actionType, data, state) => {
        return {
            meta: { aid: data.aid },
            connectPid: data.pid,
            event: elogActionMap[actionType].event,
            page: state,
            device: 'pc',
            pid: state,
            ts: (new Date()).getTime()
        } 
    },
    "viewPeopleList": (actionType, data, state) => {
        return {
            connectPid: data.connectPid,
            page: data.page,
            filter: state,
            device: 'pc',
            pid: state.user.pid,
            ts: (new Date()).getTime()
        }
    },
    "viewActivity": (actionType, data, state) => {
        /**
         * === data === 
         * aid : article id
         * targetPid : 作者 pid
         * filter: 依據page不同帶不同的參數
         */
        return {
            meta: { aid: data.aid },
            connectPid: data.targetPid,
            event: elogActionMap[actionType].event,
            page: window.elogPage,
            filter: getFilterbyPage[window.elogPage](state) || '',
            device: 'pc',
            pid: state.user.pid,
            ts: (new Date()).getTime()
        }
    }
}

const getFilterbyPage = {
    "index": (state) => {},
    "indexSave": (state) => {},
    "user": (state) => { return lodash.get(state, 'profile.user_info.pid')},
    "myCollect": (state) => { return lodash.get(state, 'profile.user_info.pid')},
    "occupa": (state) => { return lodash.get(state, 'profile.user_info.pid')},
    "occupaList": (state) => { return lodash.get(state, 'profile.user_info.pid')},
    "occupaTopic": (state) => { return lodash.get(state, 'profile.user_info.pid')},

}


export const createElogByAction = (action, state) => {
    
    const { type, params } = action;
    if( !elogActionMap[type] ) return false;
    const track = elogActionMap[type].track;

    try{
        if (canUseDOM && window._elog) {
            const ext = handlerMap[track](type, params, state);
            /*window._elog.push({
                web: 'plus',
                track: [track],
                ext: ext
            });*/
        }
    }catch(e) {
        console.log(e);
        return false;
    }

}