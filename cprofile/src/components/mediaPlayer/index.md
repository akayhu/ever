# 多媒體播放器

## 文字 TEXT

```jsx
<MediaPlayer fileId="" mediaType="TEXT" meta={{ text: '這是測試文字' }} />
```

## 影片 VEDIO

```jsx
<MediaPlayer
	fileId="e301b16ea7514930b0719dae1875473d13"
	mediaType="VIDEO"
	meta={{
		previewUrl:
			'https://file.doc.104-dev.com.tw/20c/505/61d/e301b16ea7514930b0719dae1875473d13_activityGrid.jpg?AWSAccessKeyId=AKIAJ4TWABFJGTLWFXGA&Expires=1893427200&Signature=Z8AhZS%2BLpkaDZ6xCzUYshaPqfr0%3D',
	}}
/>
```

```js
// getFileUrl response
{
	response: [
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
	];
}
```

## 音檔 AUDIO

```jsx
<MediaPlayer
	fileId="87648441b7114f20ade3f7239220e59014"
	mediaType="AUDIO"
	meta={{}}
/>
```

```js
// getFileUrl response
{
	response: [
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
	];
}
```

## 圖片 IMAGE

### avatar 頭像

```jsx
<MediaPlayer
	fileId="7092a720579b4fe2a6c80fa8345ece3911"
	convertType="avatar"
	mediaType="IMAGE"
	meta={{}}
/>
```

```js
// getFileUrl response, convertType = avatar
{
	response: [
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
	];
}
```

### 封面圖 cover

```jsx
<MediaPlayer
	fileId="b2c20ea1dded42ffaec33b818e7adfe411"
	convertType="cover"
	mediaType="IMAGE"
	meta={{}}
/>
```

```js
// getFileUrl response, convertType = cover
{
	response: [
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
	];
}
```

### 公司 LOGO

```jsx
<MediaPlayer
	fileId="ea59b125fba44bab8c5d8989ac22d8bf11"
	convertType="companyLogo"
	mediaType="IMAGE"
	meta={{}}
/>
```

```js
// getFileUrl response, convertType = companyLogo
{
	response: [
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
	];
}
```

### Plus 文章圖

```jsx
<MediaPlayer
	fileId="6b8eea53557046f39bc286f845d54acd11"
	convertType="activity"
	mediaType="IMAGE"
	meta={{}}
/>
```

```js
// getFileUrl response, convertType = activity
{
	response: [
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
	];
}
```

## DOCUMENT 文件

### PDF

```jsx
<MediaPlayer
	fileId="77e8a17c7a5742659418608ef5f9f71b12"
	mediaType="DOCUMENT"
	meta={{}}
/>
```

```js
// getFileUrl response, pdf
{
	response: [
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
	];
}
```

### docx

```jsx
<MediaPlayer
	fileId="77e8a17c7a5742659418608ef5f9f71b12"
	mediaType="DOCUMENT"
	meta={{}}
/>
```

```js
// getFileUrl response, docx
{
	response: [
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
	];
}
```

### pptx

```jsx
<MediaPlayer
	fileId="bfad1464e13c4a4d8a4020107cbdc69912"
	mediaType="DOCUMENT"
	meta={{}}
/>
```

```js
// getFileUrl response, pptx
{
	response: [
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
	];
}
```

## HYPERLINK 轉貼連結

```jsx
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
/>
```

```js
// getFileUrl response
{
	response: [
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
	];
}
```

## YOUTUBE

```jsx
<MediaPlayer
	fileId=""
	mediaType="YOUTUBE"
	meta={{ youtubeId: 'GJI4Gv7NbmE' }}
/>
```

## LINK 純連結

```jsx
<MediaPlayer
	fileId=""
	mediaType="LINK"
	meta={{
		linkUrl:
			'https://calpa.me/why-import-react-from-react-in-a-functional-component',
		originalText: '測試連結',
	}}
/>
```
