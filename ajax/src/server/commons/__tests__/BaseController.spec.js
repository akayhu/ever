import httpMocks from 'node-mocks-http';
import async from 'async';
import { json, prelog } from 'src/server/commons/BaseController';

describe('BaseController', () => {
  it('BaseController.prelog middleware', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/ajax/account/initial',
      params: {
        browserTimeStamp: 0,
        params: 1
      },
      body: {
        body: 2
      },
      query: {
        query: 3
      }
    });
    const res = httpMocks.createResponse();
    prelog(req, res, () => {
      // 感覺將 params, body, query 整在一起沒有做明確區分不太好，容許度太大不是很安全
      expect(req.paramMap).toEqual({
        params: 1,
        body: 2,
        query: 3
      });
      expect(res.json).toEqual(json);

      // 模擬後續 Response json 結果
      const jsonData = {
				errorCode: 403,
				errorMsg: '不允許存取此人 Profile 或此ID不存在'
      }
      res.status(403).json(jsonData);
      const data = JSON.parse(res._getData());
      expect(data).toEqual(jsonData);

    });
  });

});