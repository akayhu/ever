import React from 'react';
import { storiesOf } from '@storybook/react';
import { ACInput } from './index';

storiesOf('ACInput', module)
	.add('不可編輯狀態', () => <ACInput value="這是不可編輯狀態" />)
	.add('可編輯狀態', () => <ACInput value="這是可編輯狀態" editable={true} />)
	.add('公司名稱', () => (
		<ACInput
			placeHolder="請輸入公司"
			autoCompleteName="companyName"
			editable={true}
		/>
	));
