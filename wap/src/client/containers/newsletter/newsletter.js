const newsletterData = [
	{
		text: '104職涯精選：',
		key: '99e4ee47-9fb1-49cd-a8e2-e692f46b8a68', // 職涯精選：
		option: [
			{ label: '每周一次', value: 401 },
			{ label: '每月一次', value: 404 },
			{ label: '取消訂閱', value: 100 }
		],
	},
	{
		text: '人脈推薦報：',
		key: '94c7ab3d-c9fe-4d7f-80b1-629b3d6e18d0', // 人脈推薦報
		option: [
			{ label: '每周一次', value: 401 },
			{ label: '每月一次', value: 404 },
			{ label: '取消訂閱', value: 100 }
		],
	},
	{
		text: '問卷調查月報：',
		key: '97b200e0-10d4-4430-9891-3b26dc461ef8', // 問卷調查月報
		option: [
			{ label: '訂閱', value: 404 },
			{ label: '取消訂閱', value: 100 }
		],
	},
	{
		text: '104+會員服務通知：',
		key: '12f126d2-6c18-41ca-a4ea-2b5af468b4db', // 會員服務通知
		option: [
			{ label: '訂閱', value: 403 },
			{ label: '取消訂閱', value: 100 }
		],
	},
	{
		text: '社團文章通知信：',
		key: 'ae596565-a4e8-4446-a03d-43056291c190', // 社團文章通知信
		option: [
			{ label: '每天一次', value: 402 },
			{ label: '每周一次', value: 401 },
			{ label: '取消訂閱', value: 100 }
		],
	},
];

const want = txt => newsletterData.filter(wantArr => wantArr.text === txt);

export default want('104+會員服務通知：');
