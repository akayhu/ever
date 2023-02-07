import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import cs from 'classnames';
// style
import css from './index.css';
// actions
import { onAddMediaRole, onRemoveMediaRole } from 'src/client/actions/channel';

class Setting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
		};
		this.handleSetChannelRole = this.handleSetChannelRole.bind(this);
	}
	handleSetChannelRole(role) {
		const { targetPid, channelId, onAddMediaRole } = this.props;
		this.setState({ loading: true });
		onAddMediaRole({ targetPid, channelId, role }).then((success) => {
			this.setState({ loading: false });
			if (!success) {
				alert('給予頻道使用權限錯誤！');
			}
		});
	}
	handleRemoveChannelRole(role) {
		const { targetPid, channelId, onRemoveMediaRole } = this.props;
		this.setState({ loading: true });
		onRemoveMediaRole({ targetPid, channelId, role }).then((success) => {
			this.setState({ loading: false });
			if (!success) {
				alert('移除頻道使用者權限錯誤！');
			}
		});
	}
	render() {
		const { loading } = this.state;
		const { role } = this.props;
		const buttonStyle = cs('ui button', {disabled: loading});
		return (
			<DropdownMenu>
				<DropdownTarget>
					<button className={ buttonStyle }>
						設定<i className="caret down icon" />
					</button>
				</DropdownTarget>
				<DropdownList>
					<ul className="dropdown" styleName="setting_ul">
						{
              role !== 2 &&
              <li onClick={ this.handleSetChannelRole.bind(this, 2) }>設為管理員</li>
            }
						{
              role !== 1 &&
              <li onClick={ this.handleSetChannelRole.bind(this, 1) }>設為編輯</li>
            }
						{
              role !== 0 &&
              <li	onClick={ this.handleRemoveChannelRole.bind(this, 0) }>移除權限</li>
            }
					</ul>
				</DropdownList>
			</DropdownMenu>
		);
	}
}

Setting.propTypes = {
	pid: PropTypes.number.isRequired,
	targetPid: PropTypes.number.isRequired,
	channelId: PropTypes.number.isRequired,
	role: PropTypes.number.isRequired
};


export default compose(
	connect(null, { onAddMediaRole, onRemoveMediaRole }),
	[CSSModules, '_', css]
)(Setting);
