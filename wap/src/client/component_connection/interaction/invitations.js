import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { Link } from 'react-router';
import errorHandle from 'src/util/errorHandle';

import {accept, reject} from 'src/client/actions/connection';

import clientConfig from 'src/configs/client';
import css from './index.css';

class Invitations extends Component {
	// todo: 已達上限時的行為(derek)和上方條
	constructor(props) {
		super(props);
		this.state = {
			accepted: false,
			rejected: false,
			loading: false,
			upperBound: false,
			canAdd: true
		}
		this.acceptInvite = this.acceptInvite.bind(this);
		this.rejectInvite = this.rejectInvite.bind(this);
	}
	componentWillMount() {
		if (this.props.total === 800) {
			this.setState({ canAdd: false });
		}
	}
	acceptInvite() {
		const { pid, targetPid } = this.props;
		const parameters = {
			pid: pid,
			targetPid: targetPid,
		};

		this.props.accept(parameters).then(msg => {
			if (errorHandle(msg)) {
				return this.setState({upperBound: true});
			}
			this.setState({accepted: true});
		});
	}
	rejectInvite() {
		const { pid, targetPid } = this.props;
		const parameters = {
			pid: pid,
			targetPid: targetPid,
		};

		this.props.reject(parameters).then(msg => {
			if (errorHandle(msg)) return;
			this.setState({rejected: true});
		});
	}
	render() {
		const { canAdd, upperBound, accepted, rejected } = this.state;
		return (
			<div>
				{ (accepted === false && rejected === false)
					? <div styleName="invite_confirm">
							<button
								ref="submit"
								className="ui primary button"
								onClick={this.acceptInvite}
								disabled={!canAdd || upperBound}
								>
								{canAdd
									? upperBound
										? '對方好友已滿'
										: <span data-gtm-connect="交友確認">確認</span>
									: '好友已滿'
								}
							</button>
							<button
								ref="reject"
								data-gtm-connect="交友拒絕"
								className="ui normal button"
								onClick={this.rejectInvite}
							>
								拒絕邀請
							</button>
						</div>
					: this.state.accepted ? <span>已成為朋友</span> : <span>已拒絕邀請</span>
				}
			</div>
		)
	}
}

export default compose(
	connect(null, { accept, reject }),
	//translate( [] ),
	[CSSModules, '_', css]
)(Invitations)