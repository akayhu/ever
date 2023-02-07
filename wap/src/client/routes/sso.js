/* 
  登入、登出的sso網址在c_platform - /src/configs/routes.js
  讓其他sso第2層底下網址跑error頁
*/
export const sso = {
  path: '/sso/:otherPage',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/error/index').default)
    }, 'ssoOtherPage');
  }
};