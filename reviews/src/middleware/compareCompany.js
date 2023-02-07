const regex = /([A-Za-z0-9]+)(-vs-)([A-Za-z0-9]+)/;
export const compareMiddleware = ({ to, from, next, store }) => {
  if (to.params.compare) {
    if (!regex.test(to.params.compare)) {
      return next({ name: "compare" });
    }
    const combination = to.params.compare.split("-vs-");
    store.dispatch("company/getCompanyCompare", combination);
    return next();
  } else {
    store.dispatch("company/clearCompanyCompare");
    return next();
  }
};

export default compareMiddleware;
