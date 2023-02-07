"use strict";

export default function compareReduxState(){
	return (store) => (next) => (action) => {
		if ( !action['CALL_API'] ) {
			return next(action);
		}
		
		return next(action);
	};
}