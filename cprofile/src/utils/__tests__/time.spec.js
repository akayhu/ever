import { getDuration } from '../time';
import moment from 'moment';

describe('年資計算', () => {
	test.each([
		[
			'開始結束時間相同，預期為 "未滿1個月"',
			moment('2015-01'),
			moment('2015-01'),
			'未滿1個月',
		],
		['相差 1 個月', moment('2015-02'), moment('2015-03'), '1個月'],
		[
			'相差 1 年以內，只顯示 "N個月"',
			moment('2015-01'),
			moment('2015-07'),
			'6個月',
		],
		[
			'相差剛好 1 年，只顯示 "N年"',
			moment('2015-01'),
			moment('2016-01'),
			'1年',
		],
		[
			'相差剛好 1 年，只顯示 "N年"',
			moment('2015-01'),
			moment('2016-01'),
			'1年',
		],
		[
			'相差剛好整數年，只顯示 "N年"',
			moment('2015-01'),
			moment('2017-01'),
			'2年',
		],
		[
			'相差 1 年以上，顯示 "N年N個月"',
			moment('2015-01'),
			moment('2016-09'),
			'1年8個月',
		],
	])('%s', (text, startTime, endTime, seniorityText) => {
		expect(getDuration(startTime, endTime)).toBe(seniorityText);
	});
});
