import * as actions from '../bubbles';

describe('actions', () => {
  it('action - getUnreadNotify', () => {
    const getUnreadNotifyAction = {
      CALL_API: {
        type: actions.GET_UNREAD_NOTIFY,
        method: 'get',
        target: '/pusher/getUnreadNotify'
      }
    };
    expect(actions.getUnreadNotify()).toEqual(getUnreadNotifyAction)
  })
})
