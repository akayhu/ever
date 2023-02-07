import {mainDetail} from '../routes/error';

export default function passToErrorPage(state, nextState, cb) {
	nextState.location.pathname = '/m/error/'+state.errorCode+'/'+state.errorStatus;
  nextState.params = state;
  nextState.routes.splice(1,1,mainDetail);
  return mainDetail.getComponent(nextState, cb);
}