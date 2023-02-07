import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from '../../../util/compose';
// helpers
import { locationToState } from './helpers';
// components
import Nav from './nav';

class NavWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			path: 'home'
		};
	}

	componentDidMount() {
		this.handlePath();
	}

	componentWillReceiveProps() {
		this.handlePath();
	}

	handlePath() {
		if (document) {
			this.setState(locationToState(document.location));
		} else {
			this.setState(locationToState());
		}
	}

	render() {
		return <Nav { ...this.state } { ...this.props.user } />;
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
	};
}

export default compose(
	connect(mapStateToProps),
	//translate([])
)(NavWrapper);
