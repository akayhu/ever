import store from "@/store";

const registerModule = ({ to, done }) => {
  const module = registerModuleList[to.name];
  if (module && module.list.length > 0) {
    for (let item of module.list) {
      const registerName = `${module.name}/${item.name}`;
      if (!store.hasModule(registerName)) {
        store.registerModule(registerName, item.module);
      }
    }
  }
  done();
};

export default registerModule;
