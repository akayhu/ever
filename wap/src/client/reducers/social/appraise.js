import {
  QUERY_APPRAISE_LIST,
  QUERY_APPRAISE_LIST_OF_OWNER,
  ADD_APPRAISE_TEXT,
  DELETE_APPRAISE_TEXT,
  MODIFY_PUBLISH_APPRAISE_TEXT,
  PUBLISH_APPRAISE_TEXT,
  CLEAR_APPRAISE
} from '../../actions/social';
import { mergeWith } from 'lodash/object';
import { isArray } from 'lodash/lang';
import { filter, map } from 'lodash/collection';

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
      case QUERY_APPRAISE_LIST:
      case QUERY_APPRAISE_LIST_OF_OWNER:

        if (action.response === null || !action.response.response) return state;
        return {
          ...state,
          appraiseList: action.response.response
        }
      case ADD_APPRAISE_TEXT:
        if (action.response === null || !action.response.response) return state;
        return {...state,
          appraiseList: [action.response.response, ...state.appraiseList]
        }
      case DELETE_APPRAISE_TEXT:
        if (action.response === null || !action.response.response) return state;
        return {...state,
          appraiseList: filter(state.appraiseList, (item) => action.response.response.pid !== item.pid),
          listSize: state.listSize - 1
        }
      case PUBLISH_APPRAISE_TEXT:
      case MODIFY_PUBLISH_APPRAISE_TEXT:
        if (action.response === null || !action.response.response) return state;
        return {...state,
          appraiseList: map(state.appraiseList, (item) => {
            if (item.pid === action.response.response.pid) {
              return {...item,
                privateSetting: action.response.response.privateSetting
              }
            }
            return item
          })
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
