import connectionReducer from 'src/client/reducers/notification';

describe('connectionReducer', () => {
  const reducerState = {
    notificationList: {
      dataList: [{
        "nid": 151434148814454,
        "recipientId": 108190,
        "templateId": "96003dc1-9b35-4bc9-8fba-e54eee0fede9",
        "templateHash": {
          "replayname": "曉之宇智波佐助",
          "name": "宇智波佐助A",
          "@targetId": "b7b9167b-0c33-4b4e-8f6d-bb4ced8482c3"
        },
        "targetId": "b7b9167b-0c33-4b4e-8f6d-bb4ced8482c3",
        "triggerId": "100019",
        "iconUrl": "//file.doc.104-dev.com.tw/b35/67e/101/f2ae5e5e9e3d4a27965869db2b536f2711_avatarWeb.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1517797485&Signature=fiYAZmYWk56DZpQdvilowmpkbNI%3D",
        "createDate": 1514341488144,
        "message": "曉之宇智波佐助與其他1人也回應了宇智波佐助A的動態。",
        "targetLink": "https://plus.104-dev.com.tw/activity/b7b9167b-0c33-4b4e-8f6d-bb4ced8482c3",
        "targetForApp": null
      }]
    },
    empty: true,
    error: false
  };
  const getNotifictionByPidAction = {
    CALL_API: {
      type: 'GET_NOTIFICTION_BY_PID',
      method: 'get',
      target: '/notification/getNotifictionByPid',
      params: { 
        limit: 1
      }
    }
  };
  const initialData = {
    empty: false,
    error: false,
    notificationList: {
      dataList: []
    }
  };
  it('should return the initial state', () => {
    expect(connectionReducer(undefined, {})).toEqual(initialData)
  }),
  it('should handle getNotifictionByPidAction', () => {
    expect(connectionReducer(reducerState, getNotifictionByPidAction)).toEqual(reducerState)
  })
})
