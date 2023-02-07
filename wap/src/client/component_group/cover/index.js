import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { canUseDOM } from 'exenv';
import SubNav from 'src/client/component_common/subNav';
import DraggableCover from 'src/client/component_common/draggableCover';
import JoinGroupBtn from 'src/client/component_common/joinGroupBtn';
import { triggerUpdateGroup } from 'src/client/actions/group';
import { getGroupInfoData, getDataTotal } from 'src/client/reducers/group/selectors';
import { uploadCover, adjustCover, getCoverEdit } from 'src/client/component_common/avatar/upload';
import css from './index.css';

class Cover extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			coverAdjustMode: false, // 判斷是不是重新上傳 如果只是調整不要帶預設值進去 DraggableImg
		};
		this.editStatus = this.editStatus.bind(this);
		this.deleteCover = this.deleteCover.bind(this);
		this.updateCover = this.updateCover.bind(this);
		this.submitCover = this.submitCover.bind(this);
	}
	editStatus(isEditing) {
		this.setState({ editing: isEditing });
	}
	updateCover() {
		if (this.props.group.hasOwnProperty('fid')) {
			this.setState({ editing: true, coverAdjustMode: true });
			return getCoverEdit(this.props.group.fid).then(editFileUrl => editFileUrl);
		}
	}
	deleteCover() {
		return this.doUpdate({
			channelId: this.props.group.id,
			fid: '',
			picDrag: ''
		}).then(() => {
			this.setState({ editing: false });
		});
	}
	submitCover(params) {
		if (!params.file) {
			return adjustCover(this.props.group.fid, params).then(() => {
				return this.doUpdate({
					channelId: this.props.group.id,
					fid: this.props.group.fid,
					picDrag: JSON.stringify(params.coordination)
				}).then(() => {
					this.setState({ editing: false, coverAdjustMode: false });
				});
			});
		} else {
			return uploadCover('cover_file', params).then((msg) => {
				return this.doUpdate({
					channelId: this.props.group.id,
					fid: msg.fileId,
					picDrag: JSON.stringify(params.coordination)
				}).then(() => {
					this.setState({ editing: false, coverAdjustMode: false });
				});
			});
		}
	}
	doUpdate(params) {
		const { triggerUpdateGroup } = this.props;
		return triggerUpdateGroup(params);
	}
	render() {
		let picDrag;
		try {
			picDrag = JSON.parse(this.props.group.picDrag);
		} catch (e) {
			picDrag = {};
		}
		return (
			<div styleName="cover_wrap">
				<div styleName="cover">
					<DraggableCover
						type="group"
						coverUrl={ this.props.group.coverWebUrl }
						coverCoordinate={ picDrag }
						coverIsDefault={ !!(!this.props.group.fid || !this.props.group.coverWebUrl || !this.props.group.coverFileModel) }
						editable={ this.props.group.isHead || this.props.group.isAdmin }
						editStatus={ this.editStatus }
						updateCover={ this.updateCover }
						deleteCover={ this.deleteCover }
						submitCover={ this.submitCover }
						coverAdjustMode={ this.state.coverAdjustMode }
						title={ this.props.group.name }
					/>
				</div>
				{
					this.props.group.hasOwnProperty('type') &&
					<div styleName="user" className={ this.state.editing ? 'hide' : '' }>
						<div styleName="userinfo" className="h1">
							<div styleName="user_infos">
								<h1 styleName="name">{ this.props.group.name }</h1>
								<p styleName="group_type">{ this.props.group.type === 8 ? '公開' : '私人' }社團</p>
							</div>
						</div>
					</div>
				}
				<div styleName="interaction" className={ this.state.editing ? 'hide' : '' }>
					<SubNav navSetting={ this.props.navSetting } />
					<div styleName="buttons">
						{
							!this.props.dataInfoLoading &&
							<JoinGroupBtn
								buttonStyle="primary"
								channelId={ this.props.group.id }
								isHead={ this.props.group.isHead }
								isMember={ this.props.group.isMember }
								isApplying={ this.props.group.isApplying }
								joinSetting={ this.props.group.joinSetting || 0 }
								noticeStatus={ this.props.group.noticeStatus }
							/>
						}
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const nowState = state.group;
	const testStr = `${props.location.pathname.replace(/\/$/, '')}/group`;
	const result = new RegExp('/group/\\d+/(\\w+)($|/.+)', 'gi').exec(testStr);
	if (!result && canUseDOM) props.router.replace('/error/500');
	const active = (result && result[1]) || 'group';
	const {isHead, isAdmin, isMember, type} = getGroupInfoData(nowState);
	const canManage = isHead || isAdmin;
	const navSetting = {
		active,
		tagName: 'group',
		canManage,
		navList: [
			{
				title: '社團動態',
				itemKey: 'group',
				count: 0,
				url: `/group/${props.params.gid}`
			},
			{
				title: '社團成員',
				itemKey: 'member',
				count: getDataTotal(nowState, 'groupMembers') || getGroupInfoData(nowState).memberCount,
				url: (state.user.isLogin && type === 8) || (type === 7 && isMember) ? `/group/${props.params.gid}/member` : null,
			},
			{
				title: '管理社團',
				itemKey: 'management',
				count: 0,
				isShow: canManage,
				url: `/group/${props.params.gid}/management`
			}
		]
	};

	return	{
		group: getGroupInfoData(nowState),
		navSetting,
	};
}

export default compose(
	connect(mapStateToProps, { triggerUpdateGroup }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Cover);
