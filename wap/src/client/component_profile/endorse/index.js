import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import EndorseItem from './endorseItem';
import EndorsePanel from './endorsePanel';
import PickerList from 'src/client/component_common/pickerList';
import PersonalInfoComponentTitle from 'src/client/component_profile/title/personalInfo';
import { LightBox } from 'c_wap_module';
import {
	getEndorseList,
	getEndorseListConcat,
	getEndorseSortList,
	updateEndorseSort,
	createEndorse
} from 'src/client/actions/endorse';
import { loadProfile } from 'src/client/actions/profile';
import { createFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

// 專長特質與證照
class Endorse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAdd: true,
			isEdit: true,
			moreLoading: false,
			allLoading: false,
			showTopLightbox: false,
			showInteractionLightbox: false,
			showAddPanel: false,
			endorseSortData: []
		};
		this.saveEndorseSortList = this.saveEndorseSortList.bind(this);
		this.handleCreateEndorse = this.handleCreateEndorse.bind(this);
		this.getEndorseSortListData = this.getEndorseSortListData.bind(this);
		this.handleInteractionLightbox = this.handleInteractionLightbox.bind(this);
		this.more = this.more.bind(this);
		this.toggleLoading = this.toggleLoading.bind(this);
	}
	componentWillMount() {
		const { params, getEndorseSortList, getEndorseList } = this.props;
		getEndorseSortList({ pid: this.props.user.pid });
		getEndorseList({
			targetPid: params.pid,
			pid: this.props.user.pid,
			limit: 10,
			offset: 0,
			avatarLimit: 5
		});
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.promotion !== nextProps.promotion  && nextProps.promotion === 'endorse') {
			this.setState({
				showAddPanel: true
			});
		// 切換檢視角度時，endorsePanel能夠正確關閉
		} else if (nextProps.promotion === 'none') {
			this.setState({
				showAddPanel: false
			});
		}
		// 恢復尚未點擊狀態
		if (this.props.endorseList.dataList < 0) {
			this.props.createFromPromotion({ promotion: 'none' });
		}
	}
	more() {
		if (this.state.moreLoading) {
			return;
		}
		this.setState({
			moreLoading: true
		});
		const { params, endorseList, getEndorseListConcat } = this.props;
		getEndorseListConcat({
			targetPid: params.pid,
			pid: this.props.user.pid,
			limit: 10,
			offset: endorseList.dataList.length,
			avatarLimit: 5
		}).then(() => {
			this.setState({
				moreLoading: false
			});
		});
	}
	handleShowTopLightbox(value) {
		this.setState({showTopLightbox: value});
	}
	handleCreateboxShow(value) {
		// 預覽模式不提供使用
		if (this.props.interactionLock === 1) {
			this.setState({
				showInteractionLightbox: true
			});
		} else {
			this.setState({
				showAddPanel: value,
				isEdit: true
			});
		}
	}
	createBoxHide() {
		this.setState({
			showAddPanel: false
		});
	}
	handleInteractionLightbox() {
		this.setState({
			showInteractionLightbox: false
		});
	}
	getEndorseSortListData(e) {
		this.setState({endorseSortData: e.top});
	}
	handleCreateEndorse({title, desc, type}) {
		this.setState({allLoading: true});
		const { params, createEndorse, getEndorseList, getEndorseSortList, loadProfile, endorseList } = this.props;
		createEndorse({
			targetPid: params.pid,
			item: title,
			type,
			desc,
			pid: this.props.user.pid
		}).then(() => {

			this.setState({showAddPanel: false});

			getEndorseList({
				targetPid: params.pid,
				pid: this.props.user.pid,
				limit: endorseList.dataList.length + 1, // 新增會多一筆 所以要加一
				offset: 0,
				avatarLimit: 5
			}).then(() => {
				this.setState({allLoading: false});
			});
			
			if( parseInt(params.pid) === this.props.user.pid ) {
				getEndorseSortList();
				loadProfile({ pid: this.props.user.pid  });
			}
			
		});
	}
	saveEndorseSortList() {
		this.setState({allLoading: true});
		const translateUpdateEndorseSortData = {
			pid: this.props.user.pid,
			jsonArray: []
		};
		this.state.endorseSortData.map((item) => {
			translateUpdateEndorseSortData.jsonArray.push({
				sortIndex: item.sortIndex,
				item: item.item
			});
		});
		translateUpdateEndorseSortData.jsonArray = JSON.stringify(translateUpdateEndorseSortData.jsonArray);
		this.props.updateEndorseSort(translateUpdateEndorseSortData).then((res) => {
			if (res.response) {
				this.handleShowTopLightbox(false);
				this.props.getEndorseList({
					targetPid: this.props.params.pid,
					pid: this.props.user.pid,
					limit: 10,
					offset: 0,
					avatarLimit: 5
				}).then(() => {
					this.props.getEndorseSortList({ pid: this.props.params.pid });
					this.setState({allLoading: false});
				});
			}
		});
	}

	toggleLoading(value) {
		this.setState({
			allLoading: value
		});
	}

	closeAddEdit() {
		this.state.showAddPanel = false;
		this.setState(this.state);
	}

	render() {
		const topOption = {
			submit: {
				text: '儲存',
				action: this.saveEndorseSortList
			},
			cancel: {
				text: '取消'
			},
			closeIcon: true,
			contentHeight: '500px',
			title: '專長特質與證照'
		};
		const interactionOption = {
			submit: {
				text: '確定',
				action: this.handleInteractionLightbox
			},
			closeIcon: true
		};

		const mainStyle = this.props.endorseList.dataList && this.props.endorseList.dataList.length > 0 ? 'endorse_main' : '';
		return (
			<div>
				<div styleName={mainStyle}>
					{
						this.state.allLoading &&
						<div styleName="all_loading_cover">
							<div className="ui loading" />
						</div>
					}
					{ // 上排title及新增按鈕
						this.props.endorseList.dataList &&
						this.props.endorseList.dataList.length > 0 &&
						<PersonalInfoComponentTitle
							ontopButton={ this.props.viewas === 'self' }
							createButton={ this.props.user.isLogin }
							maintitle="專長特質與證照"
							ontopBtnClick={ this.handleShowTopLightbox.bind(this, true) }
							addBtnClick={ this.handleCreateboxShow.bind(this, true) }
							textAlign="left"
							viewas={ this.props.viewas }
							privacy={ this.props.privacy }
							privacyText="endorse"
							showPrivacySetting={ this.props.viewas === 'self' }
							userPid={ this.props.user.pid }
							gtmTopValue="置頂肯定"
							gtmValue="新增肯定"
							gtmTitleName="肯定隱私"
						/>
					}
					{ // 自己新增肯定 及 別人新增肯定
						this.state.showAddPanel &&
						<EndorsePanel
							add={ this.state.isAdd }
							isEdit={ this.state.isEdit }
							desc=""
							user={ this.props.user }
							viewas={ this.props.viewas }
							handleSubmit={ this.handleCreateEndorse }
							handleCancel={ this.handleCreateboxShow.bind(this, false) }
						/>
					}
					{ // 置頂的lightbox
						this.state.showTopLightbox &&
						<LightBox	option={ topOption }	onClose={ this.handleShowTopLightbox.bind(this, false) }>
							<PickerList
								items={ this.props.endorseSortList.response }
								GetFunction={ this.getEndorseSortListData }
								availableItems="請點擊要置頂的作品"
								selectedItems="已經置頂的作品"
								maxAmounts={ 10 }
							/>
						</LightBox>
					}
					{ // 肯定列表
						this.props.endorseList.dataList &&
						<dl styleName="endorse_list">
							{
								this.props.endorseList.dataList.map((obj, key) =>
									<EndorseItem
										key={ key }
										user={ this.props.user }
										userPid={ this.props.user.pid }
										avatarWebUrl={ this.props.user.avatarWebUrl }
										userName={ this.props.userName }
										createBoxHide={ this.createBoxHide.bind(this) }
										toggleLoading={ this.toggleLoading }
										dataLength={ this.props.endorseList.dataList.length }
										viewas={ this.props.viewas }
										interactionLock={ this.props.interactionLock }
										{ ...obj }
									/>
								)
							}
						</dl>
					}
					{
						this.props.endorseList.hasNext && 
						<div styleName="more">
							<a onClick={ this.more }>展開更多，還有
								{
									this.state.moreLoading &&
									<div styleName="more_loading_cover">
										<div className="ui loading" />
									</div>
								}
								{
									this.props.endorseList
									? this.props.endorseList.total - this.props.endorseList.dataList.length
									: 0
								}筆</a>
						</div>
					}
				</div>
				{
					this.state.showInteractionLightbox &&
					<LightBox option={ interactionOption } onClose={ this.handleInteractionLightbox }>
						<div className="h3">
						預覽模式不提供使用
						</div>
					</LightBox>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		endorseList: state.endorse.endorseList,
		endorseSortList: state.endorse.endorseSortList,
		interactionLock: state.profile.interactionLock
	};
}

const action = {
	getEndorseList,
	getEndorseListConcat,
	getEndorseSortList,
	updateEndorseSort,
	createEndorse,
	loadProfile,
	createFromPromotion
};

export default compose(
	connect(mapStateToProps, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Endorse);
