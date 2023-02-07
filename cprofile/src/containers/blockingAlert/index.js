import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import './style.scss';

/**
 * 滿足 condition 時，跳出提示等待 condition 不再是 true 的 HOC，提供一個方法
 *   this.props.checkConditionAndBlocking(callback)
 *
 * 執行規則
 * 1. 沒有呼叫 check 完全不會跑出任何視窗和動作
 * 2. 呼叫了 check, 當 condition = true 時才會跳視窗
 * 3. 視窗會等 condition = false 自動關掉，然後才處理 callback
 * 4. 當次呼叫若 condition = false, 直接處理 callback
 */
export const withBlockingAlert = ({
	condition,
	message,
	timeout,
}) => WrappedComponent => {
	class BlockingAlert extends Component {
		static propsTypes = {
			condition: PropTypes.bool.isRequired,
		};

		modal = null;
		timer = null;
		state = {
			blocking: false,
			condition: this.props.condition,
		};

		// new props
		static getDerivedStateFromProps(nextProps, prevState) {
			if (nextProps.condition === prevState.condition) return null;

			// 非同步執行結束，停止 block
			if (!nextProps.condition && prevState.blocking) {
				return {
					blocking: false,
					condition: false,
				};
			}

			// 更新 condition
			return {
				...prevState,
				condition: nextProps.condition,
			};
		}

		// new props and new state
		componentDidUpdate = (prevProps, prevState) => {
			// blocking 有變動才作用
			if (prevState.blocking === this.state.blocking) return;

			// 打開 modal
			if (this.state.blocking && !this.modal) return this.registerModal();

			// 關閉 modal 並執行回調
			if (this.modal) this.removeModal();
			if (typeof this.state.nextFn === 'function') {
				this.state.nextFn(...this.state.nextFnArgs);
				this.setState({ nextFn: null, nextFnArgs: [] });
			}
		};

		// 關閉並移除 alert
		removeModal = () => {
			if (this.modal) {
				this.modal.destroy();
				this.modal = null;
			}
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		};

		// 創建一個警告視窗
		registerModal = () => {
			// 隱藏所有的按鈕，等待執行完
			this.modal = Modal.confirm({
				className: 'blocking-alert',
				content: (
					<p className="blocking-alert__description">
						{typeof message === 'string'
							? message
							: '正在儲存資料中，請稍待片刻 ...'}
					</p>
				),
				okText: '',
				cancelText: '',
				okButtonProps: { style: { display: 'none' } },
				cancelButtonProps: { style: { display: 'none' } },
				destroyOnClose: true,
				centered: true,
				icon: 'loading',
				zIndex: 2100,
			});

			// timeout 機制
			this.timer = setTimeout(
				() => {
					console.error(
						'Cancel blocking alert due to timeout more than 30 seconds.'
					);
					this.modal.update({
						content: (
							<p className="blocking-alert__description">
								唔，看起來有什麼東西出錯了... <br /> 請重新整理頁面再試一次。
							</p>
						),
						maskClosable: true,
						icon: 'warning',
						okText: '確認',
						okButtonProps: {
							style: {
								backgroundColor: '#f5b532',
								border: '1px solid #f5b532',
								color: '#fff',
								fontWeight: 500,
								padding: '3px 30px',
								borderRadius: '20px',
								fontSize: '16px',
								height: '40px',
							},
						},
						onOk: () => {
							this.removeModal();
							this.setState({
								blocking: false,
								nextFn: null,
								nextFnArgs: [],
							});
						},
						onCancel: () => {
							this.removeModal();
							this.setState({
								blocking: false,
								nextFn: null,
								nextFnArgs: [],
							});
						},
					});
				},
				Number.isInteger(timeout) ? timeout : 30000
			);
		};

		// 傳給子元件的一個方法
		checkConditionAndBlocking = (nextFn, ...nextFnArgs) => {
			if (typeof nextFn !== 'function') {
				return console.error('Invalid callback in HOC Blocking Alert', nextFn);
			}

			// 沒有非同步處理，直接執行
			if (!this.props.condition) return nextFn(...nextFnArgs);

			// 有非同步處理，block 住等待執行，密集觸發就留最新的
			this.setState({
				blocking: true,
				nextFn,
				nextFnArgs,
			});
		};

		render() {
			const passingProps = {
				...this.props,
				checkConditionAndBlocking: this.checkConditionAndBlocking,
			};
			return <WrappedComponent {...passingProps} />;
		}
	}

	const mapStateToProps = state => ({
		condition: (typeof condition === 'function' && condition(state)) || false,
	});

	return connect(
		mapStateToProps,
		{}
	)(BlockingAlert);
};
