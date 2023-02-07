import * as fromBCCommunication from '../bcCommunication/selectors';
import * as fromActivity from '../activity/selectors';
// BC
export const getBCMsgList = state => fromBCCommunication.getBCMsgList(state.bcCommunication);
// Activity
export const getLightBoxActivity = state => fromActivity.getLightBoxActivity(state.activity);
export const getSortableActivities = state => fromActivity.getSortableActivities(state.activity);
export const getActivitiesByType = (state, type) => fromActivity.getActivitiesByType(state.activity, type, state.profile);
