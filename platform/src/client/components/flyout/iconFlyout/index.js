"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import deepAssign from 'deep-assign';
import {registerLayer} from '../../../actions/layerControl';
import $ from "jquery";
import css from './style.css';

class IconFlyout extends Component {
	constructor( props, context ){
		super( props, context );
		
		this.state = {
			isOpenFlyout: false,
			isFirstShow: false
		};
		
		this.mounted = false;
		this.openFlyout = this.openFlyout.bind(this);
	}

	componentDidMount(){
		this.mounted = true;
		registerLayer((target)=>{
			// console.log(target);
			if(target !== null){
				const isFlyout = $(target).parents("."+css['flyout']).length > 0;
				// console.log(isFlyout);
				if(isFlyout){
					return;
				}
			}
			
			//setTimeout(() => {
			// console.log(this.state.isOpenFlyout);
			// console.log(this.mounted);
				if(this.state.isOpenFlyout && this.mounted){
					// console.log("isFlyout false");
					this.setState({
						isOpenFlyout: false
					});
				}
			//}, 100);
		});
	}
	
	componentWillUnmount() {
		this.mounted = false;
	}
	
	openFlyout(){
		if (typeof this.props.triggerClick === 'function' ) this.props.triggerClick();
		this.setState({
			isOpenFlyout : true,
			isFirstShow: true
		});
	}

	render(){
		const { bubbles, handleClick } = this.props;
		var children = this.state.isFirstShow ? this.props.children : null;

		return (
			<div>
				<button type="button" className="ui icon button" onClick={this.openFlyout}>
					{bubbles > 0 &&
						<div styleName="bubbles_box">
				    	<span styleName="bubbles">{bubbles > 99 ? "99+" : bubbles}</span>
      			</div>
					}
					<i className={this.props.className} style={ this.props.style } data-gtm-header={this.props['data-gtm-header']}></i>
				</button>
				<div className={css['flyout']+" "+(this.state.isOpenFlyout&&css.show)}>
					{children}
				</div>
			</div>
		);
	}
}

const IconFlyoutCss = CSSModules( IconFlyout, css, { allowMultiple : true } )
//const IconFlyoutTranslate = translate( [] )( IconFlyoutCss );
export default connect(null, null)(IconFlyoutCss);