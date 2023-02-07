import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// actions
import {triggerClickBubble} from 'src/client/actions/bubble';

class NotifyIcon extends Component {
	constructor(props) {
		super(props);
		this.onClickHandler = this.onClickHandler.bind(this);
	}
	onClickHandler() {
		const {clickHandler, triggerClickBubble} = this.props;
		if (clickHandler) {
			clickHandler();
		}
		triggerClickBubble();
	}
	render() {
		const {bubbleCount} = this.props;

		return (
			<Link to={ '/m/notification' } onClick={ this.onClickHandler } styleName="wrap">
				{
					bubbleCount > 0 &&
					<span styleName="bubbles">{bubbleCount > 99 ? '99+' : bubbleCount}</span>
				}
				<i data-gtm-header="通知" className="alarm outline icon" />
			</Link>
		);
	}
}

function mapStateToProps(state) {
	return {
		bubbleCount: state.bubble.bubbleCount,
	};
}

export default compose(
	connect(mapStateToProps, {triggerClickBubble}),
	[CSSModules, '_', css],
)(NotifyIcon);
