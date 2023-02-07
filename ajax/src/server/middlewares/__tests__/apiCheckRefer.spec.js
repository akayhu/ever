import ApiCheckRefer from 'src/server/middlewares/apiCheckRefer';
import httpMocks from 'node-mocks-http';


describe('middlewares apiCheckRefer', () => {

  beforeEach(() => {
    jest.resetModules();
  });

  it('NODE_ENV = "dev" should call next()', (done) => {
    process.env.NODE_ENV = 'dev';
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/ajax/test/checkPjAPI'
    });
    let res = httpMocks.createResponse();
    ApiCheckRefer()(req, res, () => {
      done();
    });
  });

  it('NODE_ENV = "production" should call next()', (done) => {
    process.env.NODE_ENV = 'production';
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/ajax/test/checkPjAPI'
    });
    let res = httpMocks.createResponse();
    ApiCheckRefer()(req, res, () => {
      done();
    });
  });

  it('"104.com" - should call next()', (done) => {
    process.env.NODE_ENV = 'production';
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/ajax/test/checkPjAPI',
      headers: {
        referer: 'https://www.104.com/'
      }
    });
    let res = httpMocks.createResponse();
    ApiCheckRefer()(req, res, () => {
      done();
    });
  });

  it('"104.tw" - should not call the next()', (done) => {
    process.env.NODE_ENV = 'production';
    let req = httpMocks.createRequest({
      method: 'GET',
      url: '/ajax/test/checkPjAPI',
      headers: {
        referer: 'https://www.104.tw/'
      }
    });
    let res = httpMocks.createResponse();
    ApiCheckRefer()(req, res, () => {
      done.fail('"104.tw" should not call the next()');
    });
    expect(res.statusCode).toEqual(403);
    done();
  });


});