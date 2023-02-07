import * as actions from '../notification';

describe('actions', () => {
  it('action - getNotifictionByPid', () => {
    const count = { limit: 1 };
    const getNotifictionByPidAction = {
      CALL_API: {
        type: actions.GET_NOTIFICTION_BY_PID,
        method: 'get',
        target: '/notification/getNotifictionByPid',
        params: count
      }
    };
    expect(actions.getNotifictionByPid(count)).toEqual(getNotifictionByPidAction)
  })
})
