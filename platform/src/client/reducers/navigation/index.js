import { combineReducers } from 'redux';
import connection from '../connection';
import bubbles from '../bubbles';
import bcCommunication from '../bcCommunication';
import ccCommunication from '../ccCommunication';
import notification from '../notification';

export default combineReducers({
  connection,
  bubbles,
  bcCommunication,
  ccCommunication,
  notification
})
