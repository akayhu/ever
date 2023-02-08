import { interpret, Machine } from "xstate";

const newPjMachine = {
  key: "newPj",
  initial: "create",
  states: {
    // 新增預約專案狀態
    create: {
      on: {
        CREATE_PERFECTION: "createPerfection",
        BACK_CREATE: "create"
      }
    },
    // 完成新增預約專案狀態
    createPerfection: {
      on: {
        RESERVATION_PERFECTION: "reservationPerfection",
        BACK_CREATE: "create"
      }
    },
    // 可編輯預約版位或備取編輯狀態
    reservationPerfection: {
      on: {
        BACK_CREATE: "create"
      }
    }
  }
};

export default interpret(Machine(newPjMachine));
