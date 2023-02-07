import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { layerActivityClose } from 'src/client/actions/activity';

let alreadyBind = false;

class Layer extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount(){
		const self = this;
		
		if(!alreadyBind){
			alreadyBind = true;
			
			window.onpopstate = function (event) {
				self.props.layerActivityClose(false);
				document.body.removeAttribute("style");
			};
		}
	}
	componentWillUnmount() {
		document.body.removeAttribute("style");
	}
	handleCloseLayer() {
		const { onRequestClose } = this.props;
		
		if(/\/activity\//.test(location.href)){
			window.history.go(-1);
		}else{
			onRequestClose(false);
		}
		
		document.body.removeAttribute("style");
	}
	renderContent() {
		const { open, backBtnText, style, bodyStyle, children } = this.props;
		// 有animate
		if (!open) return null;
		document.body.style.overflow = 'hidden';
		// 無animate
		// if (!open) return <div />;
		return (
			<div
				id="main_layer"
				styleName="layer"
				style={ style }
			>
				<div
					styleName="layer_title"
					onClick={ this.handleCloseLayer.bind(this) }
				>
					<i
						className="angle Left icon"
						styleName="close"
					/>
					<span styleName="back_text">
						{ backBtnText }
					</span>
				</div>
				<div
					styleName="layer_body"
					style={ bodyStyle }
				>
					{ children }
				</div>
			</div>
		);
	}
	render() {
		return (
			<ReactCSSTransitionGroup
				transitionName={ {
					enter: css.enter,
					enterActive: css.enterActive,
					leave: css.leave,
					leaveActive: css.leaveActive,
				} }
				transitionEnterTimeout={ 1000 }
				transitionLeaveTimeout={ 100 }
			>
				{ this.renderContent() }
			</ReactCSSTransitionGroup>
		);
	}
}

Layer.defaultProps = {
	backBtnText: '上一頁',
	open: false,
};

Layer.propTypes = {
	backBtnText: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	onRequestClose: PropTypes.func.isRequired,
	children: PropTypes.element.isRequired,
};

export default compose(
	connect(null, { layerActivityClose }),
  [CSSModules, '_', css, { allowMultiple: true }],
)(Layer);
