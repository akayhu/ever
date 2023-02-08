import { encodeHandler } from "@/utils/keywordEncode";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useLogStore } from "@/storesPinia/log.js";

const userLogMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const { getLogDataHistory, getLog } = useLogStore();
  const userLogin = user.value.type;
  const logQuery = {
    size: 20,
    page: to.query.page || 1,
    order: "desc",
    keyId: to.query.keyId,
    accountId: encodeHandler(to.query.accountId),
    logType: Number(to.query.logType),
    logTypes: Number(to.query.logTypes),
    startDate: to.query.startDate,
    endDate: to.query.endDate
  };

  if (!to.query.accountId) delete logQuery.accountId;
  if (!to.query.startDate) delete logQuery.startDate;
  if (!to.query.endDate) delete logQuery.endDate;
  if (!to.query.logTypes) delete logQuery.logTypes;
  if (!to.query.logType) delete logQuery.logType;
  if (!to.query.keyId) delete logQuery.keyId;
  if (to.query.keyId && to.query.logType) delete logQuery.order;

  if (userLogin === 2) {
    if (to.query.keyId) {
      getLogDataHistory(logQuery);
    } else {
      getLog(logQuery);
    }
    return done();
  } else {
    return next("/");
  }
};

export default userLogMiddleware;
