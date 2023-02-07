import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import './style.scss';
import { validationHintSet, maxLengthHintSet } from 'utils/validation.js';
import { compose } from 'recompose';
import withScrollAnchor from 'containers/scrollAnchor';

/**
 * 當滿足 condition 時，跳出確認提示的 HOC
 *
 * 1. 提供一個方法 this.props.checkConditionAndShowAlert(callback)
 * 2. condition 會被合併進 mapStateToProps
 */
export const withConditionAlert = ({
	condition,
	message,
}) => WrappedComponent => {
	class ConditionAlert extends Component {
		modal = null;

		// 關閉並移除 alert
		removeModal = () => {
			if (this.modal) {
				this.modal.destroy();
				this.modal = null;
			}
		};

		scrollToFirstErrBlock = () => {
			const maxLengthHintSetLength = maxLengthHintSet.length;
			const validationHintSetLength = validationHintSet.length;
			let isCustom;
			if (validationHintSetLength > 0)
				isCustom =
					Object.keys(validationHintSet[0])[0] === 'custom' ? true : false;

			if (validationHintSetLength === 0 && maxLengthHintSetLength === 0) return;
			const blockForScroll = this.props.config.find(block => {
				const firstErrBlock =
					validationHintSetLength > 0
						? Object.keys(validationHintSet[0])[0]
						: Object.keys(maxLengthHintSet[0])[0];
				return block.get('blockType') === firstErrBlock && block.visibility;
			});
			const unikeyForScroll =
				validationHintSetLength > 0 && isCustom
					? validationHintSet[0]['unikey']
					: blockForScroll.get('uniKey');
			this.props.scrollToAnchor(unikeyForScroll);
		};

		transformHintMsg = (requiredBlock, requiredKeyword) => {
			const ajvEmptyHintKeyword = ['minLength', 'required', 'type', 'fileId'];
			const showEmptyHint = ajvEmptyHintKeyword.includes(requiredKeyword);
			const hintMsg = {
				talent: '專長、技能名稱 為必填',
				gallery:
					requiredKeyword !== 'fileId'
						? '作品集 名稱為必填'
						: '作品集 檔案為必填',
				honor:
					requiredKeyword !== 'fileId'
						? '專案 / 成就 名稱為必填'
						: '專案 / 成就 檔案為必填',
				experience: '經歷欄位 為必填',
				education: '學歷欄位 為必填',
				basic: '姓名欄位 為必填',
				custom: '客製化專區 名稱為必填',
			};
			return showEmptyHint ? hintMsg[requiredBlock] : null;
		};

		maxLengthHingMsg = (requiredBlock, requiredKeyword) => {
			const ajvEmptyHintKeyword = ['maxLength'];
			const showMaxLengthHint = ajvEmptyHintKeyword.includes(requiredKeyword);
			const hintMsg = {
				basic: '個人資料 超過字數',
				experience: '經歷欄位 超過字數',
				education: '學歷欄位 超過字數',
				honor: '專案 / 成就 超過字數',
				talent: '專長、技能名稱 超過字數',
				gallery: '作品集 超過字數',
			};
			return showMaxLengthHint ? hintMsg[requiredBlock] : null;
		};

		handleValidationInfo = () => {
			const validationHint = validationHintSet.map((hint, index) => {
				const requiredBlock = Object.keys(hint)[0];
				const requiredKeyword = Object.values(hint)[0];

				const hintMsg = this.transformHintMsg(requiredBlock, requiredKeyword);
				return (
					<p className="errBlock" key={index}>
						{' '}
						{hintMsg}{' '}
					</p>
				);
			});
			return validationHint;
		};

		handleMaxLengthInfo = () => {
			const maxLengthHint = maxLengthHintSet.map((hint, index) => {
				const requiredBlock = Object.keys(hint)[0];
				const requiredKeyword = Object.values(hint)[0];
				const hintMsg = this.maxLengthHingMsg(requiredBlock, requiredKeyword);
				return (
					<p className="errBlock" key={index}>
						{' '}
						{hintMsg}{' '}
					</p>
				);
			});
			return maxLengthHint;
		};

		renderModalContent = () => {
			const maxLengthHintSetLength = maxLengthHintSet.length;
			const validationHintSetLength = validationHintSet.length;

			return (
				<div className="confirm-alert__description">
					{maxLengthHintSetLength > 0 ? (
						<p>必填欄位已超過字數無法發布，請修改。</p>
					) : null}
					{maxLengthHintSetLength > 0 ? this.handleMaxLengthInfo() : null}
					{maxLengthHintSetLength > 0 && validationHintSetLength > 0 ? (
						<hr />
					) : null}
					{validationHintSetLength > 0 ? (
						<p className="empty_block">
							{typeof message === 'string' ? message : ''}
						</p>
					) : null}
					{validationHintSetLength > 0 ? '未填寫的項目：' : null}
					{validationHintSetLength > 0 ? this.handleValidationInfo() : null}
					{maxLengthHintSetLength === 0 ? (
						<p className="continue_publish">是否要繼續發佈?</p>
					) : null}
				</div>
			);
		};

		// 創建一個警告視窗
		registerModal = (nextFn, nextFnArgs) => {
			// 隱藏所有的按鈕，等待執行完
			this.modal = Modal.confirm({
				className:
					maxLengthHintSet.length === 0
						? 'confirm-alert'
						: 'confirm-alert no-cancel-btn',
				content: this.renderModalContent(),
				okText: maxLengthHintSet.length > 0 ? '繼續編輯' : '繼續',
				cancelText: '取消',
				okButtonProps: {
					className: 'submit',
				},
				cancelButtonProps: {
					className: 'cancel',
				},
				onOk: () => {
					if (maxLengthHintSet.length === 0) {
						nextFn(nextFnArgs);
						this.removeModal();
					} else {
						this.removeModal();
						this.scrollToFirstErrBlock();
					}
				},
				onCancel: () => {
					this.removeModal();
					this.scrollToFirstErrBlock();
				},
				maskClosable: true,
				destroyOnClose: true,
				centered: true,
				icon: 'warning',
				zIndex: 2100,
			});
		};

		// 傳給子元件的一個方法
		checkConditionAndShowAlert = (nextFn, ...nextFnArgs) => {
			if (typeof nextFn !== 'function') {
				return console.error('Invalid callback in HOC ConditionAlert', nextFn);
			}

			// 沒有滿足 block 條件，直接執行 callback
			const isConditionFullfill =
				(typeof condition === 'function' && condition(this.props.state)) ||
				false;
			if (!isConditionFullfill) return nextFn(...nextFnArgs);

			// 滿足了 block 條件，顯示提示視窗
			this.registerModal(nextFn, nextFnArgs);
		};

		render() {
			const passingProps = {
				...this.props,
				checkConditionAndShowAlert: this.checkConditionAndShowAlert,
			};
			return <WrappedComponent {...passingProps} />;
		}
	}

	const mapStateToProps = state => ({
		state,
		config: state.get('config'),
	});

	return compose(
		connect(
			mapStateToProps,
			{}
		),
		withScrollAnchor
	)(ConditionAlert);
};
