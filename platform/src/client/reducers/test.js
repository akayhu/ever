import deepAssign from 'deep-assign';
import * as testActions from '../actions/test';

export const initState = {
  pj: {
		status: {
			status: "1"
		}
	},
	po: {
		status: {
			status: "1"
		}
	},
	pi: {
		status: {
			status: "1"
		}
	}
};

export default function testReducer(state = initState, action){
	try{
		let res = null;

		switch(action.type){
			case testActions.CHECK_PJ_API:
				if (action.response === null) return state;
				res = action.response;
		    if (typeof state.pj ==='undefined') {
		    	state.pj = {}
		    }
				state.pj.status = res;
				return Object.assign({}, state );

			case testActions.CHECK_PO_API:
				if (action.response === null) return state;
				res = action.response;
		    if (typeof state.pi ==='undefined') {
		    	state.po = {}
		    }
				state.po.status = res;
				return Object.assign({}, state );

			case testActions.CHECK_PI_API:
				if (action.response === null) return state;
				res = action.response;
		    if (typeof state.pi ==='undefined') {
		    	state.pi = {}
		    }
				state.pi.status = res;
				return Object.assign({}, state );

			default:
				return state;
		}
	}catch(e){
    console.log(e)
    return state;
  }
};
