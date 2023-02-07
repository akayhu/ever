import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import cs from 'classnames';
// style
import css from './index.css';
// actions
import { changeMemberRule, onDeleteGroupMember } from 'src/client/actions/group';

class Setting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			adminState: props.admin,
			isLoading: false,
			deleting: false,
			error: ''
		};
		this.handleSetGroupAdmin = this.handleSetGroupAdmin.bind(this);
		this.handleSetGroupHead = this.handleSetGroupHead.bind(this);
		this.handleDeleteGroupMember = this.handleDeleteGroupMember.bind(this);
	}
	handleSetGroupAdmin(isAdmin) {
		const { targetPid, channelId, changeMemberRule } = this.props;
		this.setState({ isLoading: true });
		changeMemberRule({ targetPid, channelId, isAdmin }).then(success => {
			const { adminState } = this.state;
			this.setState({
				adminState: success ? !adminState : adminState,
				error: !success ? 'changeMemberRule error' : '',
				isLoading: false
			});
			(!success && alert('changeMemberRule error'));
		});
	}
	handleSetGroupHead() {}
	handleDeleteGroupMember() {
		const { targetPid, channelId, onDeleteGroupMember } = this.props;
		this.setState({ deleting: true });
		onDeleteGroupMember({ targetPid, channelId }).then(success => {
			this.setState({ deleting: false });
			(!success && alert('handleDeleteGroupMember error'));
		});
	}
	render() {
		const { adminState, isLoading, deleting } = this.state;
		const buttonStyle = cs('ui button', {disabled: isLoading || deleting});
		const { observerRule, head } = this.props;
		if (observerRule === 'Member' || observerRule === 'normal' || head)
			return null;

		return (
			<DropdownMenu toggleOpen={ () => {} }>
				<DropdownTarget>
					<button className={ buttonStyle }>
						設定<i className="caret down icon" />
					</button>
				</DropdownTarget>
				<DropdownList>
					<ul className="dropdown" styleName="setting_ul">
						{adminState
							? <li onClick={ this.handleSetGroupAdmin.bind(this, false) }>取消管理權限</li>
							: <li onClick={ this.handleSetGroupAdmin.bind(this, true) }>設為管理員</li>
						}
						<li onClick={ this.handleDeleteGroupMember }>取消團員資格</li>
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
}

Setting.defaultProps = {
	observerRule: 'Member',
	admin: false,
	head: false
};

Setting.propTypes = {
	pid: PropTypes.number.isRequired,
	targetPid: PropTypes.number.isRequired,
	observerRule: PropTypes.string.isRequired,
	channelId: PropTypes.number.isRequired,
	admin: PropTypes.bool.isRequired,
	head: PropTypes.bool.isRequired
};


export default compose(
	connect(null, { changeMemberRule, onDeleteGroupMember }),
	//translate([]),
	[CSSModules, '_', css]
)(Setting);
