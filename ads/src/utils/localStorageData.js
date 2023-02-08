const localStorageService = (() => {
  let localStorageType = {
    // 新增
    setItem: (name, state) => {
      window.localStorage.setItem(name, JSON.stringify(state));
    },
    // 讀取
    getItem: name => {
      return JSON.parse(window.localStorage.getItem(name));
    },
    // 移除 localStorage 內物件
    removeItem: name => {
      window.localStorage.removeItem(name);
    },
    // 刪除 localStorage 所有內容
    clear: () => {
      window.localStorage.clear();
    }
  };

  return {
    handleLocalStorage(type, name, state) {
      return localStorageType[type]
        ? localStorageType[type](name, state)
        : false;
    },
    addLocalStorageType(type, fn) {
      return (localStorageType[type] = fn);
    }
  };
})();

export default localStorageService;
