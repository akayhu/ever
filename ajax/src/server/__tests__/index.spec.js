jest.mock('log4js');
jest.mock('aes-node');

const request = require('supertest');
let app = require('../index');

// 目前先跳過測試
describe.skip('route /ajax/test', () => {
  it('GET /ajax/test/checkPjAPI', (done) => {
    request(app.expressApp)
      .get('/ajax/test/checkPjAPI')
      // .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toEqual(
          {
            isSuccess: 'false',
            message: 'pid參數錯誤;',
            status: ''
          }
        );
        done();
      });
  });
});