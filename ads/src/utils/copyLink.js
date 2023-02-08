import { Message } from "element-ui";

export const copyLink = link => {
  if (!link) return;
  const el = document.createElement("textarea");
  el.value = link;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);

  Message({
    message: "已複製連結",
    center: true,
    customClass: "copy_link_message_box",
    iconClass: "",
    offset: 100
  });
};
