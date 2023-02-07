import { connect } from 'react-redux';
import React, { Component } from 'react';
import ga from 'react-ga';

class Me extends Component {
	constructor(props, context) {
		super(props, context);
	}
	componentDidMount() {
		if (this.props.user.isLogin) {
			document.location.href = `/m/profile/${this.props.user.pid}`;
		} else {
			document.location.href = '/sso/saml-login?r=/m/me';
		}
	}
	render() {
		return (
			<div />
		);
	}
}

function mapStateToProps(state, props) {
	return {
		user: state.user,
	};
}

export default connect(mapStateToProps, { })(Me);
