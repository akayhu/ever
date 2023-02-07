import IpUtil from 'src/server/utils/IpUtil';

describe('IpUtil', () => {
  const ip = IpUtil();

  it('Verify the IpUtil() format', () => {
    const ipRegexp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ip === undefined) {
      expect(ip).toBeUndefined();
    } else {
      expect(ip).toEqual(expect.stringMatching(ipRegexp));
    }
  });
});