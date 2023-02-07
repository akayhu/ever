import { canUseDOM } from 'exenv';
// 點開單則 Activity
export function activityLog(activity, viewActivityLog) {
	const userPid = viewActivityLog && viewActivityLog.pid ? viewActivityLog.pid : -3;
	const pageLog = viewActivityLog && viewActivityLog.page ? viewActivityLog.page : '';
	const filterLog = viewActivityLog && viewActivityLog.filter ? viewActivityLog.filter : '';
	if (canUseDOM && window._elog) {
    window._elog.push({
      web: 'plus',
      track: ['viewActivity'],
      ext: {
        meta: { aid: activity.aid },
        connectPid: activity.pid,
        page: pageLog,
        filter: filterLog,
        device: 'pc',
        pid: userPid,
        ts: (new Date()).getTime()
      }
    });
  }
}
// 點擊 Activity 的功能
export function activityEventLog(activity, clickActivityLog) {
	const userPid = clickActivityLog && clickActivityLog.pid ? clickActivityLog.pid : -3;
  const eventLog = clickActivityLog && clickActivityLog.event ? clickActivityLog.event : '';
	const pageLog = clickActivityLog && clickActivityLog.page ? clickActivityLog.page : '';
	const filterLog = clickActivityLog && clickActivityLog.filter ? clickActivityLog.filter : '';
	if (canUseDOM && window._elog) {
    window._elog.push({
      web: 'plus',
      track: ['clickActivity'],
      ext: {
        meta: { aid: activity.aid },
        connectPid: activity.pid,
        event: eventLog,
        page: pageLog,
        filter: filterLog,
        device: 'pc',
        pid: userPid,
        ts: (new Date()).getTime()
      }
    });
  }
}
// 曝光 Activity 列表
export function activityListLog(activity, viewActivityListLog) {
	const userPid = viewActivityListLog && viewActivityListLog.pid ? viewActivityListLog.pid : -3;
  const sortLog = viewActivityListLog && viewActivityListLog.sort ? viewActivityListLog.sort : '';
	const pageLog = viewActivityListLog && viewActivityListLog.page ? viewActivityListLog.page : '';
	const filterLog = viewActivityListLog && viewActivityListLog.filter ? viewActivityListLog.filter : '';
	if (canUseDOM && window._elog) {
    window._elog.push({
      web: 'plus',
      track: ['viewActivityList'],
      ext: {
        meta: { aidList: activity.aidList },
        connectPid: activity.pid,
        page: pageLog,
        sort: sortLog,
        filter: filterLog,
        device: 'pc',
        pid: userPid,
        ts: (new Date()).getTime()
      }
    });
  }
}
// 新增一則動態
export function activityAddLog(activity, viewActivityAddLog) {
	const userPid = viewActivityAddLog && viewActivityAddLog.pid ? viewActivityAddLog.pid : -3;
	const pageLog = viewActivityAddLog && viewActivityAddLog.page ? viewActivityAddLog.page : '';
	if (canUseDOM && window._elog) {
    window._elog.push({
      web: 'plus',
      track: ['addActivity'],
      ext: {
        meta: { aid: activity.aid },
        page: pageLog,
        device: 'pc',
        pid: userPid,
        ts: (new Date()).getTime()
      }
    });
  }
}