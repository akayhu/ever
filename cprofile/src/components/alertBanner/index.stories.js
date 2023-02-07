import React from 'react';
import { storiesOf } from '@storybook/react';
import { doc } from 'storybook-readme';
import AlertBanner from './index';
import readme from './readme.md';

storiesOf('AlertBanner', module)
	.add('使用說明', doc(readme))
	.add('warning (預設)', () => (
		<AlertBanner message="這是測試文案" type="warning" />
	))
	.add('success', () => <AlertBanner message="這是測試文案" type="success" />)
	.add('info', () => <AlertBanner message="這是測試文案" type="info" />)
	.add('error', () => <AlertBanner message="這是測試文案" type="error" />)
	.add('移除關閉鈕', () => (
		<AlertBanner message="這是測試文案" type="info" closable={false} />
	));
