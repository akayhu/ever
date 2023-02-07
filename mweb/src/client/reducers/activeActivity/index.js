import { ACTIVE_ACTIVITY, OPEN_ACTIVITY_LAYER } from 'src/client/actions/activity'

export default function activeActivityReducer(state = '', action) {
	switch (action.type) {
    case OPEN_ACTIVITY_LAYER:
      return action.aid;
		case ACTIVE_ACTIVITY:
			return action.aid;
		default:
			return state;
	}
}
