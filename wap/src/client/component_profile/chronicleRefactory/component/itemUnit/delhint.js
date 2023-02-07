import React from 'react';
import { LightBox } from 'c_wap_module';

const DelHint = ({ delHandle, cancel, text }) =>
	<LightBox
		option={
		{
			closeIcon: true,
			submit: {
				text: '確定',
				action: delHandle
			},
			cancel: {
				text: '取消'
			}
		}
		}
		onClose={ cancel }
	>
		<h3>{ `確定要刪除這筆${text}？` }</h3>
	</LightBox>;

export default DelHint;
