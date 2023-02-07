import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { triggerLeaveGroup, triggerCancelApplyJoin } from 'src/client/actions/group';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';

class SettingBlock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			leaved: false,
			revoked: false,
			loading: false
		};
		this.onCancelApplyJoin = this.onCancelApplyJoin.bind(this);
		this.onLeaveGroup = this.onLeaveGroup.bind(this);
		this.renderCheckingMode = this.renderCheckingMode.bind(this);
		this.renderRejectedMode = this.renderRejectedMode.bind(this);
		this.renderOthersMode = this.renderOthersMode.bind(this);

		this.buttonTitleMap = {
			joined: '設定',
			waitForJoin: '已申請加入',
			managed: '設定'
		};
	}
	onLeaveGroup(shouldResetCategory) {
		if (this.state.loading) return;

		const { groupInfo: { id, category }, triggerLeaveGroup } = this.props;
		this.setState({ loading: true }, () => {
			triggerLeaveGroup(id, shouldResetCategory, category).then(success => {
				this.setState({
					leaved: success,
					loading: false
				});
			});
		});
	}
	onCancelApplyJoin(shouldResetCategory) {
		if (this.state.loading) return;

		const { groupInfo: { id, category }, triggerCancelApplyJoin } = this.props;
		this.setState({ loading: true }, () => {
			triggerCancelApplyJoin(id, shouldResetCategory, category).then(success => {
				this.setState({
					revoked: success,
					loading: false
				});
			});
		});
	}

	renderOthersMode() {
		const { leaved, revoked, loading } = this.state;
		const { mode, groupInfo: { isHead, id }} = this.props;

		if ((mode === 'joined' || mode === 'managed') && leaved)
			return <div styleName="response_text">已退出社團</div>;
		if (mode === 'waitForJoin' && revoked)
			return <div styleName="response_text">已收回申請</div>;

		const buttonStyle = loading ? 'ui primary button disabled loading' : 'ui primary button';

		return (
			<DropdownMenu toggleOpen={ () => {} }>
				<DropdownTarget>
					<button className={ buttonStyle }>
						{this.buttonTitleMap[mode]}&nbsp;&nbsp;&nbsp;<i className="caret down icon" />
					</button>
				</DropdownTarget>
				<DropdownList>
					<ul className="dropdown" styleName="group_list_block_viewpoint">
						{ mode === 'joined' &&
							<li onClick={ this.onLeaveGroup.bind(this, 'joined') }>
								<i />退出社團
							</li>
							}
						{ mode === 'waitForJoin' &&
							<li onClick={ this.onCancelApplyJoin.bind(this, 'waitForJoin') }>
								<i />收回申請
							</li>
						}
						{ mode === 'managed' &&
							<div>
								<li>
									<i />
									<Link to={ {pathname: `/group/${id}`, state: { toManagement: true }} }>管理社團</Link>
								</li>
								{ !isHead &&
									<li onClick={ this.onLeaveGroup.bind(this, 'managed') }>
										<i />退出社團
									</li>
								}
							</div>
            }
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
	renderCheckingMode() {
		const { groupInfo: { updateDate } } = this.props;
		const localTime = transToLocalTime(updateDate);
		return (
			<div styleName="checking_text">{`申請日期：${localTime}`}</div>
		);
	}
	renderRejectedMode() {
		const { groupInfo } = this.props;
		const	step = 'step3';
		return (
			<Link to={ {pathname: '/group/applyform', state: {groupInfo, step}} }>
				<button className="ui button primary">修改內容</button>
			</Link>
		);
	}
	renderByMode(mode) {
		if (mode === 'checking') return this.renderCheckingMode();
		if (mode === 'rejected') return this.renderRejectedMode();
		return this.renderOthersMode();
	}
	render() {
		const { mode } = this.props;
		return (
			<div styleName="group_list_block_interaction">
				{this.renderByMode(mode)}
			</div>
		);
	}
}

function transToLocalTime(timestamp) {
	return new Date(timestamp).toLocaleDateString().replace(/\//g, '.');
}

export default compose(
  connect(null, { triggerLeaveGroup, triggerCancelApplyJoin }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SettingBlock);
