import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { triggerSubscribeMedia } from 'src/client/actions/channel';
import { setDirectPanel } from 'src/client/actions/alert';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

class Indepent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSubscribe: props.subscribeSetting,
			loading: false,
		};
		this.handleClick = this.handleClick.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.subscribeSetting) {
			this.setState({
				isSubscribe: nextProps.subscribeSetting
			});
		}
	}
	handleClick() {
		if (!this.props.isLogin) {
			this.props.setDirectPanel(true);
			return;
		}

		const { channelId, triggerSubscribeMedia } = this.props;
		const { isSubscribe } = this.state;
		this.setState({ loading: true });

		triggerSubscribeMedia({ channelId }, false, isSubscribe).then(() => {
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
	subscribeRender(isSubscribe, loading) {
		const buttonStyle = loading ? 'ui loading primary button disabled' : 'ui primary button';
		if (!isSubscribe) {
			return (
				<button
					className={ buttonStyle }
					onClick={ this.handleClick }
					data-gtm-channel="關注"
				>
					關注
				</button>
			);
		}

		return (
			<DropdownMenu>
				<DropdownTarget>
					<button className={ buttonStyle }>
						已關注&nbsp;<i className="caret down icon" />
					</button>
				</DropdownTarget>
				<div className="dropdownList">
					<DropdownList>
						<ul className="dropdown" styleName="viewpoint">
							<li onClick={ this.handleClick }>
								取消關注
							</li>
						</ul>
					</DropdownList>
				</div>
			</DropdownMenu>
		);
	}
	render() {
		const { isAdmin, isEditor } = this.props;
		const { isSubscribe, loading } = this.state;
		if (isAdmin || isEditor) return null;
		return (
			<div styleName="interaction">
				{ this.subscribeRender(isSubscribe, loading) }
			</div>
		);
	}
}

Indepent.defaultProps = {
	isAdmin: false,
	channelId: 0,
	subscribeSetting: false
};

Indepent.propTypes = {
	isAdmin: PropTypes.bool.isRequired,
	subscribeSetting: PropTypes.bool.isRequired,
	channelId: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
	return {
		isLogin: state.user.isLogin
	};
}

export default compose(
	connect(mapStateToProps, { triggerSubscribeMedia, setDirectPanel }),
	[CSSModules, '_', css]
)(Indepent);
