import * as AccuseActionType from '../actions/accuse';
import update from 'react-addons-update';

export const initState = {
	//accuseList: [],
	accuseItem: {
		activity: [],
		user: []
	},
	accuseClass: 'none',
	accuseData: {}
};

export default function accuseReducer(state = initState, action){
	try{
		switch(action.type){
			case AccuseActionType.GETACCUSEITEM:
				if (action.response === null || !action.response.response) return state;
				
				var newAccuseItemClass = {};
				newAccuseItemClass[action.accuseType] = update(state.accuseItem[action.accuseType], {$set: mapKeyToItem(action.response.response) });
				
				var newAccuseItem = Object.assign({}, state.accuseItem, newAccuseItemClass);
				
				return Object.assign( {}, state, {
					accuseItem: newAccuseItem 
				});
			
			case AccuseActionType.ACCUSE_TRIGGER:
				return Object.assign( {}, state, { 
					accuseClass: action.accuseType, 
					accuseData: action.itemData 
				});
			
			case AccuseActionType.ACCUSE_TERRIBLE_ACTIVITY:
				return state;
				
			case AccuseActionType.ACCUSE_TERRIBLE_PERSON:
				return state;
			
			default:
				return state;
		}
	}catch(e){
		console.log(e)
		return state;
	}
};

function mapKeyToItem(itemArray){
	var resultArray = [];
	
	if(itemArray && itemArray.length > 0){
		for(let i=0, num=itemArray.length; i < num; i++ ){
			var newItem = {};
			newItem.label = itemArray[i].accuseItemName;
			newItem.value = itemArray[i].accuseItemCode;
			resultArray.push(newItem);
		}
	}
	
	return resultArray;
}