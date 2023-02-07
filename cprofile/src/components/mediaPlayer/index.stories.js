import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { doc } from 'storybook-readme';
import { MediaPlayer } from './index';
import readme from './index.md';

const mockDocumentGetFileUrl = {
	// 影片
	e301b16ea7514930b0719dae1875473d13: [
		{
			fileId: 'e301b16ea7514930b0719dae1875473d13',
			tag: '720p',
			convertStatus: 'success',
			fileExtension: 'm4v',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/20c/505/61d/e301b16ea7514930b0719dae1875473d13_v1_720p.mp4?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=EC8zpCrdwuJ93GrnFQSfD80Egng%3D',
			],
		},
	],
	// 聲音
	'87648441b7114f20ade3f7239220e59014': [
		{
			fileId: '87648441b7114f20ade3f7239220e59014',
			tag: 'activityPlay',
			convertStatus: 'success',
			fileExtension: 'mp3',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/acb/0b2/fdf/87648441b7114f20ade3f7239220e59014_128k.m4a?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1551254203&Signature=%2BZO%2F7FEAtxEz0DG5IqG%2Fg7%2BIJDc%3D',
			],
		},
	],
	// 圖片 - avatar
	'7092a720579b4fe2a6c80fa8345ece3911': [
		{
			fileId: '7092a720579b4fe2a6c80fa8345ece3911',
			tag: 'avatarWeb',
			convertStatus: 'success',
			fileExtension: 'png',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/19e/529/f8f/7092a720579b4fe2a6c80fa8345ece3911_avatarWeb.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=nt8xL17b0J3nCmiwMZyr4Mt6I8Y%3D',
			],
		},
		{
			fileId: '7092a720579b4fe2a6c80fa8345ece3911',
			tag: 'w600',
			convertStatus: 'success',
			fileExtension: 'png',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/19e/529/f8f/7092a720579b4fe2a6c80fa8345ece3911_w600.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=X7pl89t6xueewjPBU9tNEuMY2eo%3D',
			],
		},
	],
	// 圖片 - companyLogo
	ea59b125fba44bab8c5d8989ac22d8bf11: [
		{
			fileId: 'ea59b125fba44bab8c5d8989ac22d8bf11',
			tag: 'w300',
			convertStatus: 'success',
			fileExtension: 'png',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/983/b37/9af/ea59b125fba44bab8c5d8989ac22d8bf11_w300.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=d%2F8Eucav6VY5KcEkAWNeY7oBZ7w%3D',
			],
		},
	],
	// 圖片 - cover
	b2c20ea1dded42ffaec33b818e7adfe411: [
		{
			fileId: 'b2c20ea1dded42ffaec33b818e7adfe411',
			tag: 'w600',
			convertStatus: 'uploading',
			fileExtension: 'png',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/d7b/5d7/bc8/b2c20ea1dded42ffaec33b818e7adfe411_w600.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=dkq7GguQ7MMnwVlhYLxEx%2Bbivg0%3D',
			],
		},
		{
			fileId: 'b2c20ea1dded42ffaec33b818e7adfe411',
			tag: 'w960',
			convertStatus: 'uploading',
			fileExtension: 'png',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/d7b/5d7/bc8/b2c20ea1dded42ffaec33b818e7adfe411_w960.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=%2BxACS1NPn5ZcJP0RSxqM3IKCHTk%3D',
			],
		},
		{
			fileId: 'b2c20ea1dded42ffaec33b818e7adfe411',
			tag: 'w1920',
			convertStatus: 'uploading',
			fileExtension: 'png',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/d7b/5d7/bc8/b2c20ea1dded42ffaec33b818e7adfe411_w1920.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=lrH%2F01uDoTPbps%2FcA5mt3pYgbyI%3D',
			],
		},
	],
	// 圖片 - activity
	'6b8eea53557046f39bc286f845d54acd11': [
		{
			fileId: '6b8eea53557046f39bc286f845d54acd11',
			tag: 'activityGrid',
			convertStatus: 'success',
			fileExtension: 'png',
			msg: null,
			url: [
				'https://file.doc.104-dev.com.tw/d86/098/f96/6b8eea53557046f39bc286f845d54acd11_activityGrid.png?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=bbux7WUxX5WD%2BNr8eWg3QHslZt8%3D',
			],
		},
	],
	// 文件 - pdf
	'77e8a17c7a5742659418608ef5f9f71b12': [
		{
			fileId: '77e8a17c7a5742659418608ef5f9f71b12',
			tag: 'activityPlay',
			convertStatus: 'success',
			fileExtension: 'pdf',
			msg: null,
			url: [
				'//file.doc.104-dev.com.tw/ec5/4c4/23d/77e8a17c7a5742659418608ef5f9f71b12_activityPlay-0.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=oB3CyR4rugEN5vwBow4Hl9q5fB4%3D',
				'//file.doc.104-dev.com.tw/ec5/4c4/23d/77e8a17c7a5742659418608ef5f9f71b12_activityPlay-1.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=ko9U2nKCyrIv%2F6klEDNftlsDIRg%3D',
			],
		},
	],
	// 文件 - docx
	fee242dd9b424923bfbd79f6b42e35f712: [
		{
			fileId: 'fee242dd9b424923bfbd79f6b42e35f712',
			tag: 'activityPlay',
			convertStatus: 'success',
			fileExtension: 'docx',
			msg: null,
			url: [
				'//file.doc.104-dev.com.tw/166/06e/e9b/fee242dd9b424923bfbd79f6b42e35f712_activityPlay-0.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=%2FO5oZS8pBNZLTowD0J6S2xtjW74%3D',
				'//file.doc.104-dev.com.tw/166/06e/e9b/fee242dd9b424923bfbd79f6b42e35f712_activityPlay-1.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=%2BzAtSU3amHw6iMDkSbFu0CCAOlo%3D',
				'//file.doc.104-dev.com.tw/166/06e/e9b/fee242dd9b424923bfbd79f6b42e35f712_activityPlay-2.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=LJUfQWlvRL5pZUDUTNjYt7MIUsg%3D',
				'//file.doc.104-dev.com.tw/166/06e/e9b/fee242dd9b424923bfbd79f6b42e35f712_activityPlay-3.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=EGbLTPj1aTCtqtjyWqdQuBTDU60%3D',
			],
		},
	],
	// 文件 - pptx
	bfad1464e13c4a4d8a4020107cbdc69912: [
		{
			fileId: 'bfad1464e13c4a4d8a4020107cbdc69912',
			tag: 'activityPlay',
			convertStatus: 'success',
			fileExtension: 'pptx',
			msg: null,
			url: [
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-0.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=tDY6Y8DAAw%2FMtFt0TdFlllmp3DU%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-1.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=QGZJXkqzEWS8PjvCYiu2KisXsFg%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-2.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=yGZJgGKR%2FSgCOO5CLIJWMLpHjLQ%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-3.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=hbY8y8vb6WtRbkJPZLI30QGIfZE%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-4.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=2QADPobPHLkl%2B%2FFTUUzxjOOEA8I%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-5.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=fiX9azGk9fyZHrJxSyMduHjHNCk%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-6.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=hkRbb9shUq9p9AqXFt0W6Noqq3Y%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-7.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=VxVSJhqXDlCYVYq1iD0Pm9f%2FI0c%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-8.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=dp%2F0hgBpjvYQK0VSlpOdPmL9Ih8%3D',
				'//file.doc.104-dev.com.tw/bd8/3a7/c5c/bfad1464e13c4a4d8a4020107cbdc69912_activityPlay-9.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=zZYOjTngS4Wu3z6PaXWazHu%2BzgQ%3D',
			],
		},
	],

	// 轉貼連結
	e6044859ba1b41709cb5da313f74382607: [
		{
			fileId: 'e6044859ba1b41709cb5da313f74382607',
			tag: 'origin',
			convertStatus: 'success',
			fileExtension: 'json',
			msg: null,
			url: [
				'https://ori.doc.104-dev.com.tw/5e0/051/a34/e6044859ba1b41709cb5da313f74382607.json?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=2147483647&Signature=VEN6JyJRyvbflQV0BsmgfTKfem4%3D',
			],
		},
	],
};

const actions = {
	fetchPreviewFile: (fileId, { mediaType, convertType, onSuccess, onError }) =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				const fileUrls = mockDocumentGetFileUrl[fileId];
				if (!fileUrls) {
					onError('error');
					reject(action('fetchPreviewFile'));
					return;
				}

				const fileUrlMap = fileUrls.reduce(
					(urlsMap, file) =>
						file.tag
							? Object.assign(urlsMap, {
									[file.tag]: file.url,
							  })
							: urlsMap,
					{}
				);
				onSuccess(fileUrlMap);
				resolve(action('fetchPreviewFile'));
			}, 1500);
		}),
};

storiesOf('MediaPlayer', module)
	.add('使用說明', doc(readme))
	.add('TEXT 文字', () => (
		<MediaPlayer
			fileId=""
			mediaType="TEXT"
			meta={{ text: '這是測試文字' }}
			{...actions}
			fetchPreviewFile
			text
		/>
	))
	.add('VIDEO 影片', () => (
		<MediaPlayer
			fileId="e301b16ea7514930b0719dae1875473d13"
			mediaType="VIDEO"
			meta={{
				previewUrl:
					'https://file.doc.104-dev.com.tw/20c/505/61d/e301b16ea7514930b0719dae1875473d13_activityGrid.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1893427200&Signature=Z8AhZS%2BLpkaDZ6xCzUYshaPqfr0%3D',
			}}
			{...actions}
		/>
	))
	.add('AUDIO 音檔', () => (
		<MediaPlayer
			fileId="87648441b7114f20ade3f7239220e59014"
			mediaType="AUDIO"
			meta={{}}
			{...actions}
		/>
	))
	.add('IMAGE 圖片 - 頭像', () => (
		<MediaPlayer
			fileId="7092a720579b4fe2a6c80fa8345ece3911"
			convertType="avatar"
			mediaType="IMAGE"
			meta={{}}
			{...actions}
		/>
	))
	.add('IMAGE 圖片 - 公司 Logo', () => (
		<MediaPlayer
			fileId="ea59b125fba44bab8c5d8989ac22d8bf11"
			convertType="companyLogo"
			mediaType="IMAGE"
			meta={{}}
			{...actions}
		/>
	))
	.add('IMAGE 圖片 - 封面圖', () => (
		<MediaPlayer
			fileId="b2c20ea1dded42ffaec33b818e7adfe411"
			convertType="cover"
			mediaType="IMAGE"
			meta={{}}
			{...actions}
		/>
	))
	.add('IMAGE 圖片 - plus 文章圖', () => (
		<MediaPlayer
			fileId="6b8eea53557046f39bc286f845d54acd11"
			convertType="activity"
			mediaType="IMAGE"
			meta={{}}
			{...actions}
		/>
	))
	.add('DOCUMENT 文件 - pdf', () => (
		<MediaPlayer
			fileId="77e8a17c7a5742659418608ef5f9f71b12"
			mediaType="DOCUMENT"
			meta={{}}
			{...actions}
		/>
	))
	.add('DOCUMENT 文件 - docx', () => (
		<MediaPlayer
			fileId="fee242dd9b424923bfbd79f6b42e35f712"
			mediaType="DOCUMENT"
			meta={{}}
			{...actions}
		/>
	))
	.add('DOCUMENT 文件 - pptx', () => (
		<MediaPlayer
			fileId="bfad1464e13c4a4d8a4020107cbdc69912"
			mediaType="DOCUMENT"
			meta={{}}
			{...actions}
		/>
	))
	.add('YOUTUBE', () => (
		<MediaPlayer
			fileId=""
			mediaType="YOUTUBE"
			meta={{ youtubeId: 'GJI4Gv7NbmE' }}
			{...actions}
		/>
	))
	.add('HYPERLINK 轉貼連結預覽', () => (
		<MediaPlayer
			fileId="e6044859ba1b41709cb5da313f74382607"
			mediaType="HYPERLINK"
			meta={{
				linkContent:
					'從法律背景到 IT 工程師並兼任 YouTuber ，永遠在找機會突破自己，探索自己的可能性。',
				linkImageId: 'e313ed4c19cb486ba328e353015b6f5b11',
				linkImageUrl:
					'https://cdn-images-1.medium.com/max/1200/1*YATUeAO0LO1RWdvjjtl3tA.jpeg',
				linkTitle: '工作的定義由自己決定 — Sayuri – Monospace – Medium',
				linkUrl:
					'https://medium.com/monospace-tw/%E5%B7%A5%E4%BD%9C%E7%9A%84%E5%AE%9A%E7%BE%A9%E7%94%B1%E8%87%AA%E5%B7%B1%E6%B1%BA%E5%AE%9A-sayuri-660ecd6964bb',
			}}
			{...actions}
		/>
	))
	.add('LINK 純連結', () => (
		<MediaPlayer
			fileId=""
			mediaType="LINK"
			meta={{
				linkUrl:
					'https://calpa.me/why-import-react-from-react-in-a-functional-component',
				originalText: '測試連結',
			}}
			{...actions}
		/>
	));
