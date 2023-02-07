import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router';

/**
 * NOTE:
 * 因為 react-router Prompt 並沒有處理瀏覽器 beforeunload 事件，也就是重新整理、上下一頁等功能
 * 看起來吵了很久都沒有 PR 被 merge，故需要自己手動補上
 * https://github.com/ReactTraining/react-router/pull/4372
 *
 * 另一個作法：自幹一個 Prompt
 * https://github.com/ReactTraining/react-router/issues/5405#issuecomment-430911738
 */

const handleBeforeUnload = ComposedComponent =>
	class BrowserPrompt extends Component {
		static defaultProps = {
			when: false,
			message: '',
			beforeUnload: false,
		};
		static propTypes = {
			when: PropTypes.bool,
			message: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
				.isRequired,
		};

		constructor(props) {
			super(props);
			this.state = {
				subscribed: false,
			};
		}

		componentDidMount = () => {
			if (this.props.when) {
				this.toggleUnload(true);
			}
		};

		componentWillUnmount() {
			window.removeEventListener('beforeunload', this.onbeforeunload);
			this.setState({ subscribed: false });
		}

		componentDidUpdate = (prevProps, prevState) => {
			if (this.props.when === prevProps.when) return;
			this.toggleUnload(this.props.when);
		};

		onbeforeunload = e => {
			e.preventDefault();
			e.returnValue = this.props.message; // 基本上是沒作用的，多數瀏覽器不支援自訂 dialog 文字
		};

		toggleUnload = (value = false) => {
			if (this.state.subscribed === value) return;
			this.setState({ subscribed: value }, () => {
				this.state.subscribed
					? window.addEventListener('beforeunload', this.onbeforeunload)
					: window.removeEventListener('beforeunload', this.onbeforeunload);
			});
		};

		render() {
			return <ComposedComponent {...this.props} />;
		}
	};

export default handleBeforeUnload(Prompt);
