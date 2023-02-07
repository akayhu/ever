import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { Link } from 'react-router';

import {revoke} from 'src/client/actions/connection';
import errorHandle from 'src/util/errorHandle';

import clientConfig from 'src/configs/client';
import css from './index.css';

class RevokeInvitation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			revoked: false
		}
		this.revokeInvite = this.revokeInvite.bind(this);
	}
	revokeInvite() {
		const parameters = {
			pid: this.props.pid,
			targetPid: this.props.targetPid
		};
		this.setState({revoked: true});
		this.props.revoke(parameters).then(msg => {
			if (errorHandle(msg)) return;
			this.setState({revoked: true});
		});
	}
	render() {
		return	!this.state.revoked
							? <button className="ui primary button" onClick={this.revokeInvite}>收回交友邀請</button>
							: <p styleName="revoke_invitation_text">已收回邀請</p>
	}
}

export default compose(
	connect(null, { revoke }),
	//translate( [] ),
	[CSSModules, '_', css]
)(RevokeInvitation);