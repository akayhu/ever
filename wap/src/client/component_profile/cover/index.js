import React, {Component} from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import SubNav from 'src/client/component_common/subNav';
import DraggaleCover from 'src/client/component_common/draggableCover';
import Avatar from 'src/client/component_common/avatar';
import UserInfo from 'src/client/component_profile/userInfo';
import Interaction from 'src/client/component_profile/interaction';
import hasPermission from 'src/client/services/viewas.js';

import { updateCoverImage, deleteCoverImage, updateAvatarImage, adjustAvatarImage, deleteAvatarImage, adjustCoverImage } from 'src/client/actions/profile';
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
	}
	editStatus(isEditing) {
		this.setState({ editing: isEditing});
	}
	updateCover() {
		if (this.props.profile.hasOwnProperty('coverPhotoFileId')) {
			this.setState({ coverAdjustMode: true });
			return getCoverEdit(this.props.profile.coverPhotoFileId).then((editFileUrl) => {
				return editFileUrl;
			});
		} else {
			return false;
		}
	}
	deleteCover() {
		return this.doCoverUpdate(false, {
			pid: this.props.user.pid
		}).then(() => {
			this.setState({ editing: false });
		});
	}
	submitCover(params, updateNewCover) {

		if(!updateNewCover){
			return adjustCover(this.props.profile.coverPhotoFileId, params).then((msg) => {
				return this.doCoverUpdate(updateNewCover, {
					pid: this.props.user.pid,
					fileId: msg.fileId,
					ltx: params.coordination.ltx,
					lty: params.coordination.lty,
					rbx: params.coordination.rbx,
					rby: params.coordination.rby
				}).then(() => {
					this.setState({ editing: false, coverAdjustMode: false });
					document.body.style.cursor = 'default';
				});
			});
		} else {
			return uploadCover('cover_file', params).then((msg) => {
				return this.doCoverUpdate(updateNewCover, {
					pid: this.props.user.pid,
					fileId: msg.fileId,
					ltx: params.coordination.ltx,
					lty: params.coordination.lty,
					rbx: params.coordination.rbx,
					rby: params.coordination.rby
				}).then(() => {
					this.setState({ editing: false });
					document.body.style.cursor = 'default';
				});
			});
		}
	}
	doCoverUpdate(updateNewCover, params) {
		const { updateCoverImage, deleteCoverImage, adjustCoverImage } = this.props;
		if( updateNewCover ) return params.hasOwnProperty('fileId') ? updateCoverImage(params) : deleteCoverImage(params);
		else return params.hasOwnProperty('fileId') ? adjustCoverImage(params) : deleteCoverImage(params);
	}
	updateAvatar() {
		if (this.props.profile.hasOwnProperty('avatarPhotoFileId')) {
			return getAvatarEdit(this.props.profile.avatarPhotoFileId).then((editFileUrl) => {
				return editFileUrl;
			});
		}
	}
	deleteAvatar() {
		return this.doAvatarUpdate('delete', {
			pid: this.props.user.pid
		});
	}
	submitAvatar(type, params, avatarIsDefault) {
		if (type === 'create') {
			return uploadAvatar('avatar_file', params, false, avatarIsDefault).then((msg) => {
				return this.doAvatarUpdate(type, {
					pid: this.props.user.pid,
					fileId: msg.fileId,
					ltx: params.ltx,
					lty: params.lty,
					rbx: params.rbx,
					rby: params.rby
				});
			});
		} else if (type === 'adjust') {
			return adjustAvatar(this.props.profile.avatarPhotoFileId, params).then(() => {
				return this.doAvatarUpdate(type, {
					pid: this.props.user.pid,
					fileId: this.props.profile.avatarPhotoFileId,
					ltx: params.ltx,
					lty: params.lty,
					rbx: params.rbx,
					rby: params.rby
				});
			});
		}
	}
	doAvatarUpdate(type, params) {
		const { updateAvatarImage, adjustAvatarImage, deleteAvatarImage } = this.props;
		const { avatarPhotoFileId, avatarWebUrl } = this.props.profile;
		if (type === 'create') {
			/*
				第二個參數為coverIsDefault，用此來判斷是否原本就存在大頭貼
				若是true值則個人檔案完成度需增加
				若是false則個人檔案完成度不做變更
				（新增大頭貼及調整大頭貼是走同一套流程，所以用此判斷）
			*/
			return updateAvatarImage(params, !avatarPhotoFileId || !avatarWebUrl);
		} else if (type === 'adjust') {
			return adjustAvatarImage(params);
		} else {
			return deleteAvatarImage(params);
		}
	}
	render() {
		const { editing } = this.state;
		const { avatarCoordinate, avatarWebUrl, avatarPhotoFileId } = this.props.profile;
		return (
			<div styleName="cover_wrap">
				<div styleName="cover">
					<DraggaleCover
						type="profile"
						coverAdjustMode={ this.state.coverAdjustMode }
						coverUrl={ this.props.profile.coverWebUrl }
						coverCoordinate={ this.props.profile.coverCoordinate }
						coverIsDefault={ !this.props.profile.coverPhotoFileId || !this.props.profile.coverWebUrl }
						editable={ this.props.viewas === 'self' }
						editStatus={ this.editStatus }
						updateCover={ this.updateCover }
						deleteCover={ this.deleteCover }
						submitCover={ this.submitCover }
					/>
				</div>
				<div styleName="user" className={ editing ? 'hide' : '' }>
					<div styleName="avatar">
						<Avatar
							type="profile"
							avatarWebUrl={ avatarWebUrl }
							avatarCoordinate={ avatarCoordinate }
							avatarIsDefault={ !avatarPhotoFileId || !avatarWebUrl }
							editable={ this.props.viewas === 'self' }
							editStatus={ this.editStatus }
							updateAvatar={ this.updateAvatar }
							deleteAvatar={ this.deleteAvatar }
							submitAvatar={ this.submitAvatar }
						/>
					</div>
					<div styleName="userinfo">
						<UserInfo
							user={ this.props.user }
							viewas={ this.props.viewas }
							profile={ this.props.profile }
						/>
					</div>
				</div>
				<div styleName="interaction" className={ editing ? 'hide' : '' } >
					<SubNav navSetting={ this.props.navSetting } />
					<Interaction 
						params={ this.props.params } 
						/>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const testStr = props.location.pathname.replace(/\/$/,"")+"/profile";
	const result = new RegExp("/profile/\\d+/(\\w+)($|/.+)", "gi").exec(testStr);
	const active = (result && result[1]) ||"profile";
	// const privacyFriend = hasPermission(state.profile.viewas, state.privacy.mutualFriend, state.user.pid, props.params.pid);

	const navSetting = {
		active: active,
		tagName: 'profile',
		navList: [
			{
				title: "個人檔案",
				itemKey: "profile",
				count: 0,
				url: '/profile/' + props.params.pid
			},
			{
				title: "文章",
				itemKey: "activity",
				count: 0,
				url: '/profile/' + props.params.pid + '/activity'
			},
			{
				title: "人脈",
				itemKey: "connection",
				count: 0,
				url: '/profile/' + props.params.pid + '/connection'
			}
		]
	};
	return	{
		navSetting
	};
}

export default compose(
	connect(mapStateToProps, { updateCoverImage, deleteCoverImage, updateAvatarImage, adjustAvatarImage, deleteAvatarImage, adjustCoverImage }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Cover);
