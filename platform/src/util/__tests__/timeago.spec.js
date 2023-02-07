/* eslint-disable */
import timeAgo from '../timeago';

it('若建立時間比現在晚，應顯示 0 秒前', () => {
  expect(timeAgo(new Date(Date.now() + 1000*5).toString())).toBe('0 秒前');
  expect(timeAgo(new Date(Date.now() + 1000*60*5).toString())).toBe('0 秒前');
  expect(timeAgo(new Date(Date.now() + 1000*60*60*5).toString())).toBe('0 秒前');
  expect(timeAgo(new Date(Date.now() + 1000*60*60*24*1).toString())).toBe('0 秒前');
  expect(timeAgo(new Date(Date.now() + 1000*60*60*24*1.5).toString())).toBe('0 秒前');
  expect(timeAgo(new Date(Date.now() + 1000*60*60*24*2).toString())).toBe('0 秒前');
  expect(timeAgo(new Date(Date.now() + 1000*60*60*24*7).toString())).toBe('0 秒前');
  expect(timeAgo(new Date(Date.now() + 1000*60*60*24*10).toString())).toBe('0 秒前');
})
it('小於 1 分鐘，應顯示 x 秒前', () => {
  expect(timeAgo(new Date(Date.now() - 5000).toString())).toBe('5 秒前');
})
it('小於 1 小時，應顯示 x 分前', () => {
  expect(timeAgo(new Date(Date.now() - 1000*60*5).toString())).toBe('5 分前');
})
it('小於 1 天，應顯示 x 小時前', () => {
  expect(timeAgo(new Date(Date.now() - 1000*60*60*8).toString())).toBe('8 小時前');
})
it('大於 1 天且小於 2 天，應顯示 x 天前', () => {
  expect(timeAgo(new Date(Date.now() - 1000*60*60*24*1).toString())).toBe('1 天前');
  expect(timeAgo(new Date(Date.now() - 1000*60*60*24*1.5).toString())).toBe('1 天前');
})
it('大於等於 2 天，應顯示確切時間', () => {
  const now = Date.now();
  expect(timeAgo(new Date(now - 1000*60*60*24*2).toString())).toBe(new Date(now - 1000*60*60*24*2).toISOString().substr(0,10));
  expect(timeAgo(new Date(now - 1000*60*60*24*7).toString())).toBe(new Date(now - 1000*60*60*24*7).toISOString().substr(0,10));
  expect(timeAgo(new Date(now - 1000*60*60*24*10).toString())).toBe(new Date(now - 1000*60*60*24*10).toISOString().substr(0,10));
})