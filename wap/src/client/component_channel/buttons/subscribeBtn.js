import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { triggerSubscribeMedia } from 'src/client/actions/channel';
import { setDirectPanel } from 'src/client/actions/alert';

class SubscribeBtn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSubscribe: props.subscribeSetting,
			loading: false,
		};
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		if (!this.props.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}

		const { channelId, triggerSubscribeMedia, haveReload } = this.props;
		const { isSubscribe } = this.state;
		this.setState({ loading: true });

		triggerSubscribeMedia({
			channelId
		},
			haveReload, // 頻道頁觸發關注之後，需要重新取已關注的頻道
			isSubscribe
		).then(() => {
			if (isSubscribe) {
				this.setState({
					isSubscribe: false,
					loading: false
				});
			} else {
				this.setState({
					isSubscribe: true,
					loading: false
				});
			}
		});
	}
	render() {
		const { isAdmin, isEditor } = this.props;
		const { isSubscribe, loading } = this.state;
		const buttonStyle = loading
		? 'ui loading line button disabled'
		: 'ui line button';
		if (isAdmin || isEditor) return null;
		return (
			<button
				className={ buttonStyle }
				onClick={ this.handleClick }
				data-gtm-channel={ isSubscribe ? '取消關注' : '關注'}
			>
				{ isSubscribe ? '取消關注' : '關注'}
			</button>
		);
	}
}

SubscribeBtn.defaultProps = {
	isAdmin: false,
	subscribeSetting: false,
	channelId: 0,
	haveReload: false
};

SubscribeBtn.propTypes = {
	isAdmin: PropTypes.bool.isRequired,
	subscribeSetting: PropTypes.bool.isRequired,
	channelId: PropTypes.number.isRequired,
	haveReload: PropTypes.bool,
};

function mapStateToProps(state) {
	return {
		isLogin: state.user.isLogin
	};
}

export default compose(
	connect(mapStateToProps, { triggerSubscribeMedia, setDirectPanel }),
	[CSSModules, '_', css]
)(SubscribeBtn);
