export default (store) => (next) => (action) => {
  if (!action['CLIENT_PM']) return next(action);
  return new Promise((resolve, reject) => {
    const {type, data} = action['CLIENT_PM']
    next({
      type: type,
      response: data
    })
    resolve(data);
  });
}