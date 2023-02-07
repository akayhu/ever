import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { Link } from 'react-router';

import {revoke, subscribe} from 'src/client/actions/connection';

import RevokeInvitation from './revokeInvitation';
import SubscribePeople from 'src/client/component_common/subscribePeople';

import clientConfig from 'src/configs/client';
import css from './index.css';

class Unconfirmed extends Component {
	// 抓不到css module...
	constructor(props) {
		super(props);
		this.state = {};
		this.style = {
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
			width: '100%'
		};

	}
	render() {
		return (
			<div styleName="invite_unconfirmed" style={this.style}>
				<RevokeInvitation {...this.props} />
				<SubscribePeople {...this.props} />
			</div>
		)
	}
}

export default compose(
	connect(null, { revoke, subscribe }),
	//translate( [] ),
	[CSSModules, '_', css]
)(Unconfirmed)