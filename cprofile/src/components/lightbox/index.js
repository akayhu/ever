import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { lightboxClose } from 'actions/ui/lightbox';
import { Modal } from 'antd';
import './style.scss';

const Lightbox = props => {
	const visible = useSelector(state =>
		state.getIn(['ui', 'lightbox', 'visible'])
	);
	const dispatch = useDispatch();

	const {
		children,
		title,
		onOk,
		onCancel,
		afterClose,
		width,
		closable,
		maskClosable,
		cssClassName,
		cssStyle,
		keyboard,
	} = props;

	return (
		<Modal
			title={title ? title : ''} // 標題
			centered={true} // 垂直置中
			className={`lightbox-mode ${cssClassName}`}
			visible={visible} // 對話框是否可見
			closable={!closable ? closable : true} // 是否顯示右上角的關閉按鈕
			onOk={onOk ? onOk : () => dispatch(lightboxClose())} // 點擊確定回調
			onCancel={onCancel ? onCancel : () => dispatch(lightboxClose())} // 點擊遮罩層或右上角叉或取消按鈕的回調
			footer={null} // 底部內容，當不需要默認底部按鈕時，可以設為 footer={ null }
			keyboard={!keyboard ? keyboard : true} // 是否支持鍵盤esc關閉
			destroyOnClose={true} // 關閉時銷毀 Modal 裡的子元素
			afterClose={afterClose} // Modal 完全關閉後的回調
			width={width ? width : '620px'} // 寬度
			mask={true} // 是否展示遮罩
			maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // 遮罩樣式
			maskClosable={!maskClosable ? maskClosable : true} // 點擊遮罩層是否允許關閉
			zIndex={2100} // 設置 Modal 的 z-index，默認值為1000
			style={cssStyle ? cssStyle : ''}
		>
			{children}
		</Modal>
	);
};

export default Lightbox;
