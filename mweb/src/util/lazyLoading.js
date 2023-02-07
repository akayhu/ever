import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LazyLoading extends Component {
	componentDidMount() {
		const self = this;
		const { body } = self.props;
		
		// console.log("body: "+body);
		
		const targetNode = body ? document : document.getElementById('main_layer'); //self.topNode;
		
		self.scrollCallbackFunctionName = 'callback'+new Date().getTime();
		self[self.scrollCallbackFunctionName] = (e) => {
			const _targetNode = e.target;
			self.act.call(self, _targetNode);
		};
		
		// set action
		targetNode.addEventListener("scroll", self[self.scrollCallbackFunctionName]);
	}
	act(target) {
		// console.log(target);
		// console.log(this.props.reverseMode);
		const mainPaddingTopNoMargin = 57;
		const { loadingAct, reverseMode } = this.props;
		const _target = target === document ? document.scrollingElement || document.documentElement || document.body : target;
		
		if (reverseMode) {
			if (target.scrollTop === 0) {
				loadingAct();
			}
		} 
		else {
			// console.log("scrollTop: "+ _target.scrollTop);
			// console.log("clientHeight: "+ _target.clientHeight);
			// console.log("scrollHeight: "+ _target.scrollHeight);
			// console.log("========================");
			var current = _target.scrollTop + _target.clientHeight;
			
			if(target === document){
				current += mainPaddingTopNoMargin;
			}

			if (Math.ceil(current) >= _target.scrollHeight) {
				loadingAct();
			}
		}
	}
	componentWillUnmount() {
		const self = this;
		const { body } = self.props;
		const targetNode = body ? document :  document.getElementById('main_layer');//self.topNode;
		
		if (targetNode) {
			targetNode.removeEventListener("scroll", self[self.scrollCallbackFunctionName]);
		}
	}
	render() {
		return (
			<div ref={ (topNode) => { this.topNode = topNode; } }>
				{ this.props.children }
			</div>
		);
	}
}

LazyLoading.defaultProps = {
	body: true,
	reverseMode: false,
};

LazyLoading.propTypes = {
	loadingAct: PropTypes.func.isRequired,
	body: PropTypes.bool,
	reverseMode: PropTypes.bool,
};

// {React.cloneElement(this.props.children)}
