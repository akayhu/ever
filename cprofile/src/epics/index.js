import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineEpics } from 'redux-observable';
import { processAPIEpic } from './processAPI';
import { connectToPusher, subscribeToChannel } from './pusher';
const defaultEpics = combineEpics(
	processAPIEpic,
	connectToPusher,
	subscribeToChannel
);

export const epic$ = new BehaviorSubject(defaultEpics);
const rootEpic = (action$, store, args) =>
	epic$.mergeMap(epic => epic(action$, store, args));

export default rootEpic;
