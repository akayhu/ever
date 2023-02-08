const localStorageServer = {
  // 新增
  setItem: (name, state) => {
    window.localStorage.setItem(name, JSON.stringify(state));
  },
  // 讀取
  getItem: name => {
    window.localStorage.getItem(name);
  },
  // 移除
  removeItem: name => {
    window.localStorage.removeItem(name);
  },
  // 刪除
  clear: () => {
    window.localStorage.clear();
  }
};

export default localStorageServer;
