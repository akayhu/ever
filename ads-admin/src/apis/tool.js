import req from "./https";

// 切換使用者身分
export const apiPutToolSwitchRole = params => {
  return req(
    "put",
    `/tool/switch-role?role=${params.role}`,
    null,
    "putToolSwitchRole"
  );
};
