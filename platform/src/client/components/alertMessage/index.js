import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import AlertBlock from './alertBlock';
import css from './index.css';

class AlertMessage extends Component {
	constructor(props, context) {
		super( props, context );
	}
	
	render() {
		if(this.props.alert.show === false){
			return null;
		}
		
		return (
			<div styleName="result_main">
				{
					this.props.alert.queue.map((data, index) => {
						return <AlertBlock data={data} key={data.elemId} />
					})
				}
			</div>
		);
	}
}

function mapStateToProps( state, props ){
	return {
		alert: state.alert
	};
}
const AlertMessageCss = CSSModules( AlertMessage, css, { allowMultiple: true } )

export default connect(mapStateToProps)(AlertMessageCss);
