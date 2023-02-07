import React, { Component, Fragment } from 'react';
import { fromJS, List } from 'immutable';
import { connect } from 'react-redux';
import { generateId } from 'utils/idGenerator';
import { menubarOpen } from 'actions/ui/menubar';
import { changeShowTag } from 'actions/ui/factory';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { archiveCard, addBlockElem } from 'actions/ui/card';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-horiz';
import Lightbox from 'components/lightbox';
import nameMap from 'config/nameMap';
import FontIcon from 'material-ui/FontIcon';
import { moveCard, updateCardOrder } from 'actions/ui/card';
import { updateSortProcess } from 'actions/sort';
import {
	SubmitButton,
	GrayBorderButtonWhiteBackground,
} from 'share/styledComponents';
import './style.scss';

class MobileBlockToolBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMobileBlockSortLightbox: false,
			showList: props.blocksList || List(),
			switchTransition: {
				fromTop: null,
				fromBottom: null,
			},
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (!prevState.showMobileBlockSortLightbox) {
			return {
				...prevState,
				showList: nextProps.blocksList,
			};
		}
		return null;
	}

	// mobile 觸發左側顯示模板選擇
	onTriggerMobileShowMenu = () => {
		const { menubarOpen, changeShowTag, config } = this.props;
		menubarOpen();
		changeShowTag(config.blockType);
	};

	// mobile 新增一筆資料段
	onTriggerMobileAddElem = () => {
		const { uniKey, blockType, templateType } = this.props.config;
		const newUID = generateId('tmp-new');
		this.props.addBlockElem(blockType, uniKey, newUID, templateType);
	};

	// mobile 區塊拖曳排序
	onTriggerMobileConnectBlock = () => {
		this.setState({ showMobileBlockSortLightbox: true });
		this.props.lightboxOpen();
	};

	// mobile 隱藏區塊
	onTriggerMobileRemoveBlock = () => {
		const { uniKey, blockType, templateType } = this.props.config;
		this.props.archiveCard(uniKey, blockType, templateType);
		this.props.pushSystemMessage(
			'此區塊已隱藏，點擊左側選單可再顯示區塊唷！',
			'info'
		);
	};

	// 關閉lightbox
	handleLightboxCancel = () => {
		this.setState({ showMobileBlockSortLightbox: false });
		this.props.lightboxClose();
	};

	// 送出排序更新
	onUpdateBlockOrder = () => {
		this.props.updateCardOrder(this.state.showList.toJS());
		this.props.updateSortProcess('BLOCK');
		this.handleLightboxCancel();
	};

	// mobile 往上、往下移動位置(拖曳)
	onTriggerMobileBlockMove = (key, prevIndex, direction) => {
		if (!['toTop', 'toBottom'].includes(direction)) return;
		const nextIndex = direction === 'toTop' ? prevIndex - 1 : prevIndex + 1;

		// 先跑動畫
		this.setState({
			switchTransition:
				direction === 'toTop'
					? {
							fromTop: nextIndex,
							fromBottom: prevIndex,
					  }
					: {
							fromTop: prevIndex,
							fromBottom: nextIndex,
					  },
		});
		// 隔 0.5s 才真的交換資料
		setTimeout(() => {
			this.setState({
				switchTransition: {
					fromTop: null,
					fromBottom: null,
				},
				showList: this.state.showList
					.filter(elm => elm !== key)
					.splice(nextIndex, 0, key),
			});
		}, 500);
	};

	// 區塊標題
	renderBlockTitle = (key, index) => {
		const { configEntity, dataEntity } = this.props;
		const { showList, switchTransition } = this.state;
		const blockConfig = configEntity.get(key);

		if (!blockConfig) return null;

		const blockType = blockConfig.get('blockType');
		if (!blockType) return null;

		let data = dataEntity.get(key) || fromJS({});
		let title = data.get('title');

		// 過濾未儲存的資料
		if (blockType === 'custom' && /tmp-/i.test(data.get('customId')))
			return null;

		// 交換區塊的轉場動畫
		let switchTransitionRole = 'none';
		if (switchTransition.fromTop === index) switchTransitionRole = 'fromTop';
		if (switchTransition.fromBottom === index)
			switchTransitionRole = 'fromBottom';
		return (
			<div
				key={index}
				className="mobileBlockSortTitleMain switchTransition"
				data-switch-transition-role={switchTransitionRole}
			>
				<div className="mobileBlockSortTitle">
					{blockType === 'custom' ? title : nameMap[blockType].name}
				</div>
				<div
					className={
						index !== 0 && index !== showList.size - 1
							? 'mobileBlockSortButton'
							: 'mobileBlockSortButton one'
					}
				>
					{index !== 0 && (
						<FontIcon
							className={
								index !== 0 && index !== showList.size - 1
									? 'icon-arrow-up2'
									: 'icon-arrow-up2 rightBorder'
							}
							onClick={this.onTriggerMobileBlockMove.bind(
								this,
								key,
								index,
								'toTop'
							)}
						/>
					)}
					{index !== showList.size - 1 && (
						<FontIcon
							className={
								index !== 0 && index !== showList.size - 1
									? 'icon-arrow-down2'
									: 'icon-arrow-down2 rightBorder'
							}
							onClick={this.onTriggerMobileBlockMove.bind(
								this,
								key,
								index,
								'toBottom'
							)}
						/>
					)}
				</div>
			</div>
		);
	};

	render() {
		const { config } = this.props;
		const { showMobileBlockSortLightbox, showList } = this.state;
		const { blockType } = config;
		const showAddElemButton = ![
			'custom',
			'github',
			'behance',
			'plus_activity',
		].includes(blockType);
		const showMenuButton = !['custom'].includes(blockType);
		return (
			<Fragment>
				<IconMenu
					iconButtonElement={
						<IconButton>
							<MoreVertIcon />
						</IconButton>
					}
					anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
				>
					{showAddElemButton && (
						<MenuItem
							primaryText="新增一筆資料"
							onClick={this.onTriggerMobileAddElem}
							className="mobile-toolbar-item"
						/>
					)}
					<MenuItem
						primaryText="區塊排序"
						className="mobile-toolbar-item"
						onClick={this.onTriggerMobileConnectBlock}
					/>
					{showMenuButton && (
						<MenuItem
							primaryText="更換樣式"
							className="mobile-toolbar-item"
							onClick={this.onTriggerMobileShowMenu}
						/>
					)}
					<MenuItem
						primaryText="隱藏此區塊"
						className="mobile-toolbar-item"
						onClick={this.onTriggerMobileRemoveBlock}
					/>
				</IconMenu>
				{showMobileBlockSortLightbox && (
					<Lightbox
						title="調整區塊排序"
						onCancel={this.handleLightboxCancel}
						cssClassName="mobile-renderBlock-sort"
					>
						<div className="mobile-renderBlockTitle-list-main">
							{showList.map((key, index) => this.renderBlockTitle(key, index))}
						</div>
						<div className="mobile-renderBlockTitle-list-SubmitButton-main">
							<GrayBorderButtonWhiteBackground
								onClick={this.handleLightboxCancel}
							>
								取消
							</GrayBorderButtonWhiteBackground>
							<SubmitButton onClick={this.onUpdateBlockOrder}>
								變更排序
							</SubmitButton>
						</div>
					</Lightbox>
				)}
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	blocksList: state
		.get('blocksList')
		.filter(uniKey => state.getIn(['config', uniKey, 'blockType']) !== 'basic'),
	dataEntity: state.get('data'),
	configEntity: state.get('config'),
	visible: state.getIn(['ui', 'lightbox', 'visible']),
	mobileBlockSortVisible: state.getIn(['ui', 'mobileBlockSort', 'visible']),
});

export default connect(
	mapStateToProps,
	{
		archiveCard,
		addBlockElem,
		menubarOpen,
		changeShowTag,
		pushSystemMessage,
		lightboxOpen,
		lightboxClose,
		moveCard,
		updateSortProcess,
		updateCardOrder,
	}
)(MobileBlockToolBar);
