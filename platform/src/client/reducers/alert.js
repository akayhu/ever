"use strict";

import clientConfig from '../../configs/client';
import * as ALertActionType from '../actions/alert';
import sendErrorToSlack from '../../util/SendErrorToSlackUtil';

export let initState = {
	show:false,
	queue: [],
	showDirectPanel: false
};

let lock = false;
let tempQueue = [];

export default function alertReducer(state = initState, action) {
	switch(action.type){
		case ALertActionType.SET_DIRECT_PANEL: {
			return {
				...state,
				showDirectPanel: action.show
			}
		}
		case 'LOCK_CLEAR' : 
			lock = true;
			return state;
			
		case 'CLEAR_ALERT':
			if(state.queue.length > 0){
				const target = state.queue.filter((data) => {
					return data.elemId === action.elemId;
				});
				
				const nearCloseTimeTarget = state.queue.filter((data) => {
					return (data.time - target.time) < 5000;
				})
				
				if(nearCloseTimeTarget.length > 0){
					return state;
				}
			}
		
			const newQueue = state.queue.filter((data) => {
				return data.elemId !== action.elemId;
			});
			
			state.queue = newQueue.concat(tempQueue);
			tempQueue = [];
			lock = false;
			
			if(state.queue.length > 0){
				state.show = true;
			}else{
				state.show = false;
			}
			
			return Object.assign({}, state);
			
		case 'SHOW_ALERT':
			const elemId = "id_"+ (Math.round(Math.random() * 2147483647));
			const time = new Date().getTime();
			
			if(lock === true){
				tempQueue.push({
					elemId: elemId,
					time: time,
					code : action.code,
					title: action.title, 
					message: action.message,
					realMessage: '',
					fromAction: true
				});
			}else{
				state.queue.push({
					elemId: elemId,
					time: time,
					code : action.code,
					title: action.title, 
					message: action.message,
					realMessage: '',
					fromAction: true
				});
			}
			
			state.show = true;
			
			return Object.assign({}, state);
		case 'CREATE_ALERT':
			return {
				...state,
				desc: action.desc
			}
        case 'CLOSE_ALERT':
			return {
				...state,
				desc: null
			}
			
		default:
			if(['dev','lab'].indexOf(clientConfig.env) !== -1 && action.response && action.response.hasOwnProperty('errorCode')){
				const elemId = "id_"+ (Math.round(Math.random() * 2147483647));
				const time = new Date().getTime();
				
				if(lock === true){
					tempQueue.push({
						elemId: elemId,
						time: time,
						code : action.response.errorCode,
						title: action.type, 
						message: '系統忙碌中，請稍候再試試！',
						realMessage: action.response.errorMsg
					});
				}else{
					state.queue.push({
						elemId: elemId,
						time: time,
						code : action.response.errorCode,
						title: action.type,  
						message: '系統忙碌中，請稍候再試試！',
						realMessage: action.response.errorMsg
					});
				}
				
				sendErrorToSlack(action.response);
				
				state.show = true;
			}

			return Object.assign({}, state);
	}
};