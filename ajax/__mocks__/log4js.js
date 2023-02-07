const log4js = jest.genMockFromModule('log4js');

log4js.configure = (setting) => {};
log4js.getLogger = () => ({
  setLevel: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
});
log4js.connectLogger = () => {
  return (req, res, next) => {
    next();
  }
};

module.exports = log4js;