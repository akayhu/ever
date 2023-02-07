import httpMocks from 'node-mocks-http';
import ErrorHandler from 'src/server/middlewares/ErrorHandler';

describe('middlewares ErrorHandler', () => {
  const req = httpMocks.createRequest({
    method: 'GET',
    url: '/ajax/account/initial'
  });
  let res;

  beforeEach(() => {
    jest.resetModules();
    res = httpMocks.createResponse();
  });

  it('ErrorHandler 404', (done) => {
    const errorCode = 404;
    ErrorHandler(errorCode)(req, res, () => {
      done.fail('should not call the next()');
    });

    // 正常 HTTP Status Code 還是應該要回 404 才對
    // expect(res.statusCode).toEqual(errorCode);

    const data = JSON.parse(res._getData());
    expect(data.errorCode).toEqual(errorCode);
    expect(data.errorMsg).not.toBeUndefined();
    done();
  });

  it('ErrorHandler 401', (done) => {
    const errorCode = 401;
    const error = new Error();
    error.errorCode = errorCode;
    ErrorHandler()(error, req, res, () => {
      done.fail('should not call the next()');
    });

    // 正常 HTTP Status Code 還是應該要回 401 才對
    // expect(res.statusCode).toEqual(errorCode);

    const data = JSON.parse(res._getData());
    expect(data.errorCode).toEqual(errorCode);
    expect(data.errorMsg).not.toBeUndefined();
    done();
  });

  it('ErrorHandler 500', (done) => {
    const errorCode = 500;
    const error = new Error();
    error.errorCode = errorCode;
    ErrorHandler()(error, req, res, () => {
      done.fail('should not call the next()');
    });

    // 正常 HTTP Status Code 還是應該要回 500 才對
    // expect(res.statusCode).toEqual(errorCode);

    const data = JSON.parse(res._getData());
    expect(data.errorCode).toEqual(errorCode);
    expect(data.errorMsg).not.toBeUndefined();
    done();
  });

  it('other ErrorHandler should call next()', (done) => {
    const error = new Error();
    ErrorHandler()(error, req, res, () => {
      done();
    });
  });

});