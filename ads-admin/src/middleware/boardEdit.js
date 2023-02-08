import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useBoardStore } from "@/storesPinia/board.js";

const boardEditMiddleware = ({ to, next, done }) => {
  const userStore = useUserStore();
  const boardStore = useBoardStore();
  const { user } = storeToRefs(userStore);
  const { getBoardId } = boardStore;
  const userLogin = user.value.type;
  const boardIdQuery = {
    boardId: to.query.boardId,
    channelId: to.query.channelId,
    siteId: to.query.siteId
  };

  if (userLogin === 2) {
    getBoardId(boardIdQuery).then(() => {
      return done();
    });
  } else {
    return next("/");
  }
};

export default boardEditMiddleware;
