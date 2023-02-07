import {
  QUERY_APPRAISE_LIST_NOT_SORT,
  CLEAR_APPRAISE
} from '../../actions/social';
import { mergeWith } from 'lodash/object';
import { isArray } from 'lodash/lang';

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
      case QUERY_APPRAISE_LIST_NOT_SORT:
        return mergeWith(state, response, customizer)
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
