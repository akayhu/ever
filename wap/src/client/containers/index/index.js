"use strict";

import { connect } from 'react-redux';
import React, { Component } from 'react';
import AfterLogin from 'src/client/containers/index/afterLogin';
import Topic from 'src/client/containers/topic/index';
import FeaturePage from 'src/client/containers/prelogin/feature/index';

class Index extends Component {
	render() {
		return this.props.user && this.props.user.isLogin === true ? 
			<AfterLogin 
				getParamMap={this.props.getParamMap}
				location={this.props.location}
				params={this.props.params}
				route={this.props.route}
				routeParams={this.props.routeParams}
				router={this.props.router}
				routes={this.props.routes} />:
			<FeaturePage />;
	}
}

function mapStateToProps(state){
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Index);
