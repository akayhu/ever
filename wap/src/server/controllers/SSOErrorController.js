export const ssoActionCode = (req, res, next) => {
  req.passToLayoutState = {
    errorCode: 404,
    errorMsg: '抱歉，這個頁面不存在'
  };
  next();
};