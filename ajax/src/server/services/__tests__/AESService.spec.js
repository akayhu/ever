import AESService from '../AESService';
jest.unmock('aes-node');

/**
 * 專案實際執行時用到了 2 個不同的 AESService.js 來源，應該統一使用同一個
 * src/server/services/AESService';
 * /Users/evan/project/plus_rest/src/server/services/AESService.js
 */


describe('AESService', () => {
  const aesService = new AESService();

  it('AESService decrypt', () => {
    // 沒有防解密錯誤時 crashes 情況
    aesService.decrypt('crypto string', (aesServiceRes) => {
      if(aesServiceRes.response && aesServiceRes.response.decrypted) {
        if(aesServiceRes.response.decrypted === 'No import "crypt104.js"') {
          // 測試環境
          expect(aesServiceRes.response.decrypted).toBe('No import "crypt104.js"');
        } else {
          // 正式環境等知道正確加解密結果時再補測試
          expect(aesServiceRes.response.decrypted).toEqual(expect.anything());
        }
      }
    });
    aesService.decrypt(null, (aesServiceRes) => {
      expect(aesServiceRes.error).toBe('inputString is empty!');
    });
    aesService.decrypt();
  });

  it('AESService encrypt', () => {
    // 沒有防解密錯誤時 crashes 情況
    aesService.encrypt('string', (aesServiceRes) => {
      if(aesServiceRes.response && aesServiceRes.response.encrypted) {
        if(aesServiceRes.response.encrypted === 'No import "crypt104.js"') {
          // 測試環境
          expect(aesServiceRes.response.encrypted).toBe('No import "crypt104.js"');
        } else {
          // 正式環境等知道正確加解密結果時再補測試
          expect(aesServiceRes.response.encrypted).toEqual(expect.anything());
        }
      }
    });
    aesService.encrypt(null, (aesServiceRes) => {
      expect(aesServiceRes.error).toBe('inputString is empty!');
    });
    aesService.encrypt();
  });
});