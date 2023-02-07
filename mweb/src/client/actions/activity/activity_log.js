// import { canUseDOM } from 'exenv';

const canUseDOM = !!(typeof window !== 'undefined' && window._elog);

export function activityLog(activity, viewActivityLog) {
	const userPid = viewActivityLog && viewActivityLog.pid && viewActivityLog.pid !== -3 ? viewActivityLog.pid : -3;
	const pageLog = viewActivityLog && viewActivityLog.page ? viewActivityLog.page : '';
	const filterLog = viewActivityLog && viewActivityLog.filter ? viewActivityLog.filter : '';
  /*if(activity && activity.aid){
  console.log('activity', activity);
  console.log('activity.aid', activity.aid);
  console.log('activity.pid', activity.pid);
  }
  console.log('userPid', userPid);
  console.log('pageLog', pageLog);
  console.log('filterLog', filterLog);*/
	if (canUseDOM && window._elog && activity && activity.aid) {
    window._elog.push({
      web: 'plus',
      track: ['viewActivity'],
      ext: {
        meta: { aid: activity.aid },
        connectPid: activity.pid,
        page: pageLog,
        filter: filterLog,
        device: 'mw',
        pid: userPid,
        ts: (new Date()).getTime()
      }
    });
  }
}

export function activityEventLog(activity, clickActivityLog) {
	const userPid = clickActivityLog && clickActivityLog.pid ? clickActivityLog.pid : -3;
  const eventLog = clickActivityLog && clickActivityLog.event ? clickActivityLog.event : '';
	const pageLog = clickActivityLog && clickActivityLog.page ? clickActivityLog.page : '';
	const filterLog = clickActivityLog && clickActivityLog.filter ? clickActivityLog.filter : '';
  /*if(activity && activity.aid){
  console.log('activity.aid', activity.aid);
  console.log('activity.pid', activity.pid);
  }
  console.log('eventLog', eventLog);
  console.log('userPid', userPid);
  console.log('pageLog', pageLog);
  console.log('filterLog', filterLog);*/
	if (canUseDOM && window._elog && clickActivityLog.pid !== -3 && activity && activity.aid ) {
    window._elog.push({
      web: 'plus',
      track: ['clickActivity'],
      ext: {
        meta: { aid: activity.aid },
        connectPid: activity.pid,
        event: eventLog,
        page: pageLog,
        filter: filterLog,
        device: 'mw',
        pid: userPid,
        ts: (new Date()).getTime()
      }
    });
  }
}