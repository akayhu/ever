import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
//import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
//import css from './index.css';
import Error404 from './404';
import Error500 from './500';
import clientConfig from 'src/configs/client';
import {components as CPlatformComponents} from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class ErrorPage extends Component {
	constructor( props, context ){
		super( props, context );
	}
	render() {
		return (
			<ViewWrapper {...this.props} >
				<div className="container_wrap">
					{
						this.props.params.errorCode === '404' &&
						<Error404 error_status={this.props.params.error_status} />
					}
					{
						this.props.params.errorCode === '500' &&
						<Error500 error_status={this.props.params.error_status}  />
					}
					{
						this.props.params.errorCode !== '500' &&
						this.props.params.errorCode !== '404' &&
						<Error404 />
					}
				</div>
			</ViewWrapper>
		);
	}
}

// function mapStateToProps ( state, props ) {
// 	if(!state.error.error_code){
// 		state.error = {
// 			error_code: props.location.params.error_code,
// 			error_status: 
// 		}
// 	}
	
// 	return {
// 		error : state.error
// 	};
// }

export default compose(
		//connect(mapStateToProps),
		//translate([]),
		//[CSSModules, '_', css, { allowMultiple: true }]
	)(ErrorPage);