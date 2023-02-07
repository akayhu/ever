import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import SubNav from 'src/client/component_common/subNav';
import DraggableCover from 'src/client/component_common/draggableCover';
import Avatar from 'src/client/component_common/avatar';
import Indepent from '../buttons/indepent';
import { saveChannelUpdate } from 'src/client/actions/channel';
import { getChannelInfoData } from 'src/client/reducers/channel';
import { uploadCover, adjustCover, getCoverEdit, uploadAvatar, adjustAvatar, getAvatarEdit } from 'src/client/component_common/avatar/upload';
import css from './index.css';

class Cover extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			editing: false,
			coverAdjustMode: false, // 判斷是不是重新上傳 如果只是調整不要帶預設值進去 DraggableImg
		};
		this.editStatus = this.editStatus.bind(this);
		this.deleteCover = this.deleteCover.bind(this);
		this.updateCover = this.updateCover.bind(this);
		this.submitCover = this.submitCover.bind(this);
		this.deleteAvatar = this.deleteAvatar.bind(this);
		this.updateAvatar = this.updateAvatar.bind(this);
		this.submitAvatar = this.submitAvatar.bind(this);
		this.jsonParsing = this.jsonParsing.bind(this);
	}
	editStatus(isEditing) {
		this.setState({ editing: isEditing });
	}
	updateCover() {
		if (this.props.channel.hasOwnProperty('fid')) {
			this.setState({ editing: true, coverAdjustMode: true });
			return getCoverEdit(this.props.channel.fid).then(editFileUrl => editFileUrl);
		}
		return false;
	}
	deleteCover() {
		return this.doUpdate({
			channelId: this.props.channel.id,
			coverFid: '',
			coverPicDrag: ''
		}).then(() => {
			this.setState({ editing: false });
		});
	}
	submitCover(params) {
		if (!params.file) {
			return adjustCover(this.props.channel.fid, params).then(() => this.doUpdate({
				channelId: this.props.channel.id,
				coverFid: this.props.channel.fid,
				coverPicDrag: JSON.stringify(params.coordination)
			}).then(() => {
				this.setState({ editing: false, coverAdjustMode: false });
				document.body.style.cursor = 'default';
			}));
		}
		return uploadCover('cover_file', params).then(msg => this.doUpdate({
			channelId: this.props.channel.id,
			coverFid: msg.fileId,
			coverPicDrag: JSON.stringify(params.coordination)
		}).then(() => {
			this.setState({ editing: false, coverAdjustMode: false });
			document.body.style.cursor = 'default';
		}));
	}
	updateAvatar() {
		if (this.props.channel.hasOwnProperty('avatarFileId')) {
			return getAvatarEdit(this.props.channel.avatarFileId).then(editFileUrl => editFileUrl);
		}
		return false;
	}
	deleteAvatar() {
		return this.doUpdate({
			channelId: this.props.channel.id,
			pid: this.props.user.pid,
			avatarFileId: '',
			avatarCoordinate: ''
		}).then(() => {
			this.setState({ editing: false });
		});
	}
	submitAvatar(type, params) {
		if (type === 'create') {
			return uploadAvatar('avatar_file', params).then((msg) => {
				return this.doUpdate({
					channelId: this.props.channel.id,
					avatarFileId: msg.fileId,
					avatarCoordinate: JSON.stringify({
						ltx: params.ltx,
						lty: params.lty,
						rbx: params.rbx,
						rby: params.rby
					})
				}).then(() => {
					this.setState({ editing: false });
				});
				document.body.style.cursor = 'default';
			});
		} else if (type === 'adjust') {
			return adjustAvatar(this.props.channel.avatarFileId, params).then(() => {
				return this.doUpdate({
					channelId: this.props.channel.id,
					avatarFileId: this.props.channel.avatarFileId,
					avatarCoordinate: JSON.stringify({
						ltx: params.ltx,
						lty: params.lty,
						rbx: params.rbx,
						rby: params.rby
					})
				}).then(() => {
					this.setState({ editing: false });
				});
				document.body.style.cursor = 'default';
			});
		}
	}
	doUpdate(params) {
		const { saveChannelUpdate } = this.props;
		return saveChannelUpdate(params);
	}
	jsonParsing(json) {
		if (!json) return {};
		try {
			return JSON.parse(json || '{}');
		} catch (e) {
			return {};
		}
	}
	render() {
		return (
			<div styleName="cover_wrap">
				<div styleName="cover">
					<DraggableCover
						type="channel"
						coverUrl={ this.props.channel.coverWebUrl }
						coverCoordinate={ this.jsonParsing(this.props.channel.picDrag) }
						coverIsDefault={ !!(!this.props.channel.fid || !this.props.channel.coverWebUrl || !this.props.channel.coverFileModel) }
						editable={ this.props.channel.isAdmin }
						editStatus={ this.editStatus }
						updateCover={ this.updateCover }
						deleteCover={ this.deleteCover }
						submitCover={ this.submitCover }
						coverAdjustMode={ this.state.coverAdjustMode }
						title={ this.props.channel.name }
					/>
				</div>
				<div styleName="user" className={ this.state.editing ? 'hide' : '' }>
					<div styleName="avatar">
						<Avatar
							type="channel"
							showEdit={ !this.state.editing }
							avatarWebUrl={ this.props.channel.avatarWebUrl }
							avatarCoordinate={ this.jsonParsing(this.props.channel.avatarCoordinate) }
							avatarIsDefault={ !!(!this.props.channel.avatarFileId || !this.props.channel.avatarWebUrl || !this.props.channel.avatarFileModel) }
							editable={ this.props.channel.isAdmin }
							editStatus={ this.editStatus }
							updateAvatar={ this.updateAvatar }
							deleteAvatar={ this.deleteAvatar }
							submitAvatar={ this.submitAvatar }
						/>
					</div>
					<div styleName="userinfo" className="h1">
						<div styleName="user_infos">
							<h1 styleName="name">{ this.props.channel.name }</h1>
						</div>
					</div>
				</div>
				<div styleName="interaction" className={ this.state.editing ? 'hide' : '' }>
					<SubNav navSetting={ this.props.navSetting } />
					<Indepent
						isAdmin={ this.props.channel.isAdmin }
						isEditor={ this.props.channel.isEditor }
						subscribeSetting={ this.props.channel.subscribe }
						channelId={ this.props.channel.id }
					/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const nowState = state.channel;
	const { isAdmin, subscribeCount } = getChannelInfoData(nowState);
	const testStr = `${props.location.pathname.replace(/\/$/, '')}/channel`;
	const result = new RegExp('/channel/\\d+/(\\w+)($|/.+)', 'gi').exec(testStr);
	const active = (result && result[1]) || 'channel';
	const navSetting = {
		active,
		tagName: 'channel',
		navList: [
			{
				title: '頻道文章',
				itemKey: 'channel',
				count: 0,
				url: `/channel/${props.params.cid}`
			},
			{
				title: '關注人數',
				itemKey: 'member',
				count: subscribeCount,
				url: state.user.isLogin ? `/channel/${props.params.cid}/member` : null
			},
			{
				title: '頻道設定',
				itemKey: 'management',
				count: 0,
				isShow: isAdmin,
				url: `/channel/${props.params.cid}/management`
			}
		]
	};
	return	{
		channel: getChannelInfoData(nowState),
		user: state.user,
		navSetting
	};
}

export default compose(
	connect(mapStateToProps, { saveChannelUpdate }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Cover);
