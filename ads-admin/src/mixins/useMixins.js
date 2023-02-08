import { useRouter } from "vue-router";
import { parseObjQuery } from "@/utils/queryString.js";

export default () => {
  const router = useRouter();
  const jump = (path, query) => {
    router.push({ path, query: parseObjQuery(query) }).catch(() => {});
  };
  const jumpToFirstErr = () => {
    setTimeout(() => {
      const firstInvalidField = document.querySelectorAll(
        ".error_message_border"
      )[0];

      Element.prototype.documentOffsetTop = () => {
        return (
          window.offsetTop +
          (window.offsetParent ? window.offsetParent.documentOffsetTop() : 0)
        );
      };

      const top =
        firstInvalidField.documentOffsetTop() - window.innerHeight / 2;

      window.scrollTo(0, top);
    }, 100);
  };

  return { jump, jumpToFirstErr };
};
