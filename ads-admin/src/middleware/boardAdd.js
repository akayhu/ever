import { storeToRefs } from "pinia";
import { useUserStore } from "@/storesPinia/user.js";
import { useBoardStore } from "@/storesPinia/board.js";

const boardAddMiddleware = ({ next, done }) => {
  const userStore = useUserStore();
  const boardStore = useBoardStore();
  const { user } = storeToRefs(userStore);
  const { clearBoardId } = boardStore;
  const userLogin = user.value.type;

  if (userLogin === 2) {
    clearBoardId();
    return done();
  } else {
    return next("/");
  }
};

export default boardAddMiddleware;
