import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import errorHandle from '../../../../util/errorHandle';
// style
import css from './style.css';
// <ac></ac>tions
import { connectionAccept, connectionReject } from '../../../actions/connection';

class ConnectionButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accepted: false,
			rejected: false,
			loading: false,
			upperBound: false,
			canAdd: props.total !== 800,
			errorMsg: ''
		};
		this.acceptInvite = this.acceptInvite.bind(this);
		this.rejectInvite = this.rejectInvite.bind(this);
	}

	getParams() {
		const { pid, targetPid } = this.props;
		return {
			pid,
			targetPid,
		};
	}
	acceptInvite() {
		const parameters = this.getParams();

		this.props.connectionAccept(parameters).then((msg) => {
			if (errorHandle(msg)) {
				return this.setState({
					upperBound: true,
					errorMsg: '系統異常，請稍後再試'
				});
			}
			this.setState({accepted: true});
		});
	}
	rejectInvite() {
		const parameters = this.getParams();

		this.props.connectionReject(parameters).then((msg) => {
			if (errorHandle(msg)) {
				return this.setState({
					errorMsg: '系統異常，請稍後再試'
				});
			}
			this.setState({rejected: true});
		});
	}
	render() {
		const { accepted, rejected, canAdd, upperBound, errorMsg } = this.state;
		if (errorMsg) return <span>{errorMsg}</span>;

		return (
			<div>
				{ (accepted === false && rejected === false)
					? <div styleName="invite_confirm">
						<button
							className="ui primary button"
							onClick={ this.acceptInvite }
							disabled={ !canAdd || upperBound }
						>
							{canAdd
								? upperBound
									? '對方好友已滿'
									: '確認'
								: '好友已滿'
							}
						</button>
						<button
							className="ui normal button"
							onClick={ this.rejectInvite }
						>
							拒絕邀請
						</button>
					</div>
					: accepted ? <span>已成為朋友</span> : <span>已拒絕邀請</span>
				}
			</div>
		);
	}
}

const ConnectionButtonCss = CSSModules( ConnectionButton, css, { allowMultiple : true } )
//const ConnectionButtonTranslate = translate( [] )( ConnectionButtonCss );
export default connect(null, { connectionAccept, connectionReject })(ConnectionButtonCss);
