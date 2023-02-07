import {
  QUERY_APPRAISE_PENDING_LIST,
  DELETE_PENDDING_APPRAISE,
  MODIFY_PUBLISH_APPRAISE_TEXT,
  CLEAR_APPRAISE
} from '../../actions/social';
import { mergeWith } from 'lodash/object';
import { isArray } from 'lodash/lang';
import { filter } from 'lodash/collection';

function customizer(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export const initialState = {
  appraiseList: [],
  listSize: 0,
  lastTimeInMillis: 0,
  visitorInList: false
}

export default function(state = initialState, action) {
  try{
    switch (action.type) {
      case QUERY_APPRAISE_PENDING_LIST:
        return mergeWith(state, response, customizer)
      case MODIFY_PUBLISH_APPRAISE_TEXT:
      case DELETE_PENDDING_APPRAISE:
        // action中的params要變成response
        return {...state,
          appraiseList: filter(state.appraiseList, (item) => response.id !== item.id),
          listSize: state.listSize - 1
        }
      case CLEAR_APPRAISE:
        return initialState
      default:
        return state
    }
  }catch(e){
    console.log(e)
    return state;
  }
}
