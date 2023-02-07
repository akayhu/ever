import { LEADER_BOARD_NAME_REF, LEADER_BOARD_TYPE } from "@/utils/enum.js";

const leaderBoardMiddleware = ({ to, from, next, store }) => {
  const currentKey = Object.keys(LEADER_BOARD_NAME_REF).find(
    key => LEADER_BOARD_NAME_REF[key].routeName === to.params.type
  );
  if (!currentKey) {
    return next({ path: "/top" });
  }
  store.dispatch("leaderBoard/getLeaderBoard", LEADER_BOARD_TYPE[currentKey]);
  return next();
};
export default leaderBoardMiddleware;
