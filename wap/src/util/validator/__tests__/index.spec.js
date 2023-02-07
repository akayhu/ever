/* eslint-disable */
import Validators from 'src/util/validator';


describe('validator', () => {
  const validator = new Validators({
    data: {
      name: ['notEmpty', { maxLength: 10 }],
      userName: ['notEmpty',{ maxLength: 5 }]
    }
  });

  it('驗證 Empty', () => {
    const validResult = validator.validate({ name: '' });
    expect(validResult.status).toBeFalsy();
  });

  it('驗證超過字數', () => {
    // name
    let validResult = validator.validate({ name: '1234567890+' });
    expect(validResult.status).toBeFalsy();
    // userName
    validResult = validator.validate({ userName: '12345+' });
    expect(validResult.status).toBeFalsy();
  });

  it('驗證通過', () => {
    const input = { name: '1234567890' };
    const validResult = validator.validate(input);
    expect(validResult.status).toBeTruthy();
    expect(validResult.input).toEqual(input);

    // console.log(validResult);
    // errorMessage 應該也要重置才對，不應該永遠都是'輸入的字數已達上限'
    // expect(validResult.errorMessage['name']).toBeUndefined();
  });
});
