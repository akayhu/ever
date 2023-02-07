import uuid from 'uuid/v4';
import { Map, fromJS } from 'immutable';
import schema from '../../config/schema';
import honorSchema from '../../config/honorSchema';
import { cardRecord } from '../../reducers/config';
import {
	isValidStage,
	isUUID,
	validateDataModel,
	isAllRequiredFieldDone,
} from '../validation';

beforeEach(() => {
	console.log = jest.fn();
	console.warn = jest.fn();
	console.error = jest.fn();
});

describe('環境檢查', () => {
	it('預設判斷 local 本機環境為合法值', () => {
		expect(isValidStage(undefined, 'local')).toBe(true);
		expect(isValidStage(undefined, 'lab')).toBe(false);
	});
	it('預期合法環境只接受字串陣列', () => {
		expect(isValidStage(123, 'local')).toBe(false);
		expect(console.error).toBeCalledTimes(1);
	});
	it('當前環境是合法的，預期為 true', () => {
		expect(isValidStage(['test'], 'test')).toBe(true);
	});
	it('當前環境不合法，預期為 false', () => {
		expect(isValidStage(['test'], 'woo')).toBe(false);
	});
});

describe('UUID 格式檢查', () => {
	test.each([
		['uuid 格式預期為合法', uuid(), true],
		['數字預期為不合法', 123, false],
		['空字串預期為不合法', '', false],
		['字串格式不為 uuid, 預期為不合法', 'jason', false],
		['物件預期為不合法', { foo: 'bar' }, false],
		['函式預期為不合法', () => {}, false],
		['時間物件預期為不合法', Date(), false],
	])('%s', (text, target, expResult) => {
		expect(isUUID(target)).toBe(expResult);
	});
});

describe('資料 Model 檢查', () => {
	it('檢查通過預期得到 true', () => {
		const data = { test: 'yooo' };
		const schema = {
			type: 'object',
			required: ['test'],
			properties: { test: { type: 'string' } },
		};
		expect(validateDataModel(data, schema)).toBe(true);
	});
	it('檢查未通過預期得到 false，並觸發警告訊息', () => {
		const data = { test: 123 };
		const schema = {
			type: 'object',
			required: ['test'],
			properties: { test: { type: 'string' } },
		};
		expect(validateDataModel(data, schema)).toBe(false);
		expect(console.warn).toHaveBeenCalled();
	});
	it('Model Schema 不合法預期得到 false，並觸發錯誤訊息', () => {
		const data = { test: 'yooo' };
		const schema = 12;
		expect(validateDataModel(data, schema)).toBe(false);
		expect(console.error).toHaveBeenCalled();
	});
	it('完全沒帶參數預期得到 false，並觸發錯誤訊息', () => {
		expect(validateDataModel()).toBe(false);
		expect(console.error).toHaveBeenCalled();
	});
});

describe('區塊必填欄位檢查', () => {
	it('所有可見區塊的資料必填都填了，預期得到 true', () => {
		const config = Map({
			'e95d021e-6c72-4e7e-9e68-b027634cd823': cardRecord(
				'e95d021e-6c72-4e7e-9e68-b027634cd823',
				'basic'
			)(),
			'9036f9ac-b1cc-45f5-a987-1b4e827a8e7d': cardRecord(
				'9036f9ac-b1cc-45f5-a987-1b4e827a8e7d',
				'honor'
			)(),
		});
		const data = fromJS({
			'e95d021e-6c72-4e7e-9e68-b027634cd823': {
				createDate: 1544497100000,
				pid: 243173,
				personalUri: null,
				coverFileId: null,
				avatarFileId: '08bce4d675984e48adc8431226e41b4111',
				organization: 'f1231235555ㄉ55',
				location: null,
				userName: 'anguson',
				updateDate: 1545647695000,
				coverFileUrls: null,
				extraInfoLink: null,
				title: '123ˇ',
				avatarFileUrls: {
					origin:
						'//ori.doc.104-dev.com.tw/83b/403/abd/08bce4d675984e48adc8431226e41b4111.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1545798455&Signature=TvaeTZvGlHJ%2FucrjidLkeIPXlB8%3D',
					avatarWeb:
						'//file.doc.104-dev.com.tw/83b/403/abd/08bce4d675984e48adc8431226e41b4111_avatarWeb.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1545798455&Signature=nWfDmx0Ly4VnMr8Fjl5O2JnKFU0%3D',
					w600:
						'//file.doc.104-dev.com.tw/83b/403/abd/08bce4d675984e48adc8431226e41b4111_w600.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1545798455&Signature=R0lU1O7mrNW1iK%2BJMgvb8CMj9Lk%3D',
				},
				introduction: '<p>這是測試gooogog</p>',
			},
			'9036f9ac-b1cc-45f5-a987-1b4e827a8e7d': [
				{
					endMonth: null,
					honorId: '94e6b05d-40d6-44b2-ab50-681268e7b1d1',
					fileUrlMap: null,
					talentList: null,
					pid: 243173,
					fileId: '08bce4d675984e48adc8431226e41b4111',
					title: '專案2',
					endYear: null,
					createTimestamp: 1545458484981,
					description: '<p>gogogog</p>',
					startMonth: null,
					startYear: null,
				},
				{
					endMonth: null,
					honorId: '0234c96b-297d-4bc1-a9c1-e7e35364b33f',
					fileUrlMap: null,
					talentList: null,
					pid: 243173,
					fileId: '08bce4d675984e48adc8431226e41b4111',
					title: '專案3',
					endYear: null,
					createTimestamp: 1545044187645,
					description: '<p>yoooo</p>',
					startMonth: null,
					startYear: null,
				},
				{
					endMonth: null,
					honorId: 'c594b6b7-aaab-4eb7-8758-df8a80dfcf32',
					fileUrlMap: null,
					talentList: null,
					pid: 243173,
					fileId: '08bce4d675984e48adc8431226e41b4111',
					title: '專案1',
					endYear: null,
					createTimestamp: 1545044193652,
					description: '<p>yooo11111111</p>',
					startMonth: null,
					startYear: null,
				},
			],
		});
		expect(isAllRequiredFieldDone(config, data, schema, honorSchema)).toBe(
			true
		);
	});
	it('只要有任一個資料必填未填，預期得到 false', () => {
		const config = Map({
			'e95d021e-6c72-4e7e-9e68-b027634cd823': cardRecord(
				'e95d021e-6c72-4e7e-9e68-b027634cd823',
				'basic'
			)(),
			'9036f9ac-b1cc-45f5-a987-1b4e827a8e7d': cardRecord(
				'9036f9ac-b1cc-45f5-a987-1b4e827a8e7d',
				'honor'
			)(),
		});
		const data = fromJS({
			'e95d021e-6c72-4e7e-9e68-b027634cd823': {
				createDate: 1544497100000,
				pid: 243173,
				personalUri: null,
				coverFileId: null,
				avatarFileId: '08bce4d675984e48adc8431226e41b4111',
				organization: 'f1231235555ㄉ55',
				location: null,
				userName: 'anguson',
				updateDate: 1545647695000,
				coverFileUrls: null,
				extraInfoLink: null,
				title: '123ˇ',
				avatarFileUrls: {
					origin:
						'//ori.doc.104-dev.com.tw/83b/403/abd/08bce4d675984e48adc8431226e41b4111.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1545798455&Signature=TvaeTZvGlHJ%2FucrjidLkeIPXlB8%3D',
					avatarWeb:
						'//file.doc.104-dev.com.tw/83b/403/abd/08bce4d675984e48adc8431226e41b4111_avatarWeb.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1545798455&Signature=nWfDmx0Ly4VnMr8Fjl5O2JnKFU0%3D',
					w600:
						'//file.doc.104-dev.com.tw/83b/403/abd/08bce4d675984e48adc8431226e41b4111_w600.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1545798455&Signature=R0lU1O7mrNW1iK%2BJMgvb8CMj9Lk%3D',
				},
				introduction: '<p>這是測試gooogog</p>',
			},
			'9036f9ac-b1cc-45f5-a987-1b4e827a8e7d': [
				{
					endMonth: null,
					honorId: '94e6b05d-40d6-44b2-ab50-681268e7b1d1',
					fileUrlMap: null,
					talentList: null,
					pid: 243173,
					fileId: null,
					title: '專案2',
					endYear: null,
					createTimestamp: 1545458484981,
					description: '<p>gogogog</p>',
					startMonth: null,
					startYear: null,
				},
				{
					endMonth: null,
					honorId: '0234c96b-297d-4bc1-a9c1-e7e35364b33f',
					fileUrlMap: null,
					talentList: null,
					pid: 243173,
					fileId: null,
					title: '專案3',
					endYear: null,
					createTimestamp: 1545044187645,
					description: '<p>yoooo</p>',
					startMonth: null,
					startYear: null,
				},
				{
					endMonth: null,
					honorId: 'c594b6b7-aaab-4eb7-8758-df8a80dfcf32',
					fileUrlMap: null,
					talentList: null,
					pid: 243173,
					fileId: null,
					title: '',
					endYear: null,
					createTimestamp: 1545044193652,
					description: '<p>yooo11111111</p>',
					startMonth: null,
					startYear: null,
				},
			],
		});
		expect(isAllRequiredFieldDone(config, data, schema, honorSchema)).toBe(
			false
		);
	});
	it('不檢查隱藏的區塊', () => {
		const config = Map({
			'dd80956f-b87d-42b4-9390-59b2ab002053': cardRecord(
				'dd80956f-b87d-42b4-9390-59b2ab002053',
				'gallery'
			)({ visibility: false }),
		});
		const data = fromJS({
			'dd80956f-b87d-42b4-9390-59b2ab002053': [
				{
					pid: 243173,
					galleryId: 'de767f0c-19d5-4f98-bf3e-f5f400ee7860',
					title: '',
					description: null,
					fileId: null,
					createTimestamp: 1545468202420,
					fileUrlMap: null,
				},
			],
		});
		expect(isAllRequiredFieldDone(config, data, schema, honorSchema)).toBe(
			true
		);
	});
	it('不檢查 connector 第三方服務', () => {
		const config = Map({
			'84f914de-4cec-4b52-b09b-1fbab2067aea': cardRecord(
				'84f914de-4cec-4b52-b09b-1fbab2067aea',
				'github'
			)(),
		});
		const data = fromJS({
			'84f914de-4cec-4b52-b09b-1fbab2067aea': {},
		});
		expect(isAllRequiredFieldDone(config, data, schema, honorSchema)).toBe(
			true
		);
	});
	it('含有未知的區塊 type 預期得到 false 並觸發錯誤訊息', () => {
		const config = Map({
			'84f914de-4cec-4b52-b09b-1fbab2067aea': cardRecord(
				'84f914de-4cec-4b52-b09b-1fbab2067aea',
				'hahaha'
			)(),
		});
		const data = fromJS({
			'84f914de-4cec-4b52-b09b-1fbab2067aea': {},
		});
		expect(isAllRequiredFieldDone(config, data, schema, honorSchema)).toBe(
			false
		);
		expect(console.error).toBeCalledTimes(1);
	});
});
