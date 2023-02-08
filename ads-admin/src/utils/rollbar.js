import Rollbar from "rollbar";

const _rollbar = new Rollbar({
  accessToken: `${process.env.VUE_APP_ROLLBAR_ACCESS_TOKEN}`,
  enabled: process.env.VUE_APP_ENV !== "development"
});

export const setConfig = userInfo => {
  _rollbar.configure({
    payload: {
      person: {
        id: userInfo.accountId
      },
      environment: process.env.VUE_APP_ENV
    }
  });
};

// rollbar error 傳送數據格式
export const rollbarError = (response, actionName, errorMsg) => {
  _rollbar.error(
    `[API] ${actionName}::/api${response.config.url}: ${errorMsg}`,
    {
      type: "API",
      method: actionName,
      resource: `/api${response.config.url}`,
      message: response.data?.error || response.data?.warning,
      data: response.config.data
    }
  );
};

export default _rollbar;
