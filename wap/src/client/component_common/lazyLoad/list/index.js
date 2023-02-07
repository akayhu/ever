import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

export default class LazyLoading extends Component {
	componentDidMount() {
		const { body } = this.props;
		// set action
		if (body) {
			const targetNode = document.scrollingElement || document.documentElement || document.body;
			document.onscroll = throttle(this.act.bind(this, targetNode), 200);
		} else {
			const targetNode = this.topNode.childNodes[0] || document.scrollingElement || document.documentElement || document.body;
			targetNode.onscroll = throttle(this.act.bind(this, targetNode), 200);
		}
	}
	act(target) {
		// console.log(target);
		const { loadingAct = () => {} } = this.props;
		if (this.props.reverseMode) {
			if (target.scrollTop === 0) {
				loadingAct();
			}
		} else {
			const current = Math.ceil(target.scrollTop + target.clientHeight);
			if (current >= target.scrollHeight - 50) {
				loadingAct();
			}
		}
	}

	componentWillUnmount() {
		const { body } = this.props;
		const targetNode = body ? document : this.topNode.childNodes[0];
		if (targetNode) {
			targetNode.onscroll = null;
		}
	}

	render() {
		return (
			<div ref={ _ref => (this.topNode = _ref) } style={ { height: '100%' } }>
				{React.cloneElement(this.props.children)}
			</div>
		);
	}
}

LazyLoading.propTypes = {
	loadingAct: PropTypes.func,
	body: PropTypes.bool,
	reverseMode: PropTypes.bool
};
