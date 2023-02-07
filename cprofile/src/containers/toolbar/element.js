import React, { Component, Fragment } from 'react';
import { fromJS } from 'immutable';
import FontIcon from 'material-ui/FontIcon';
import { connect } from 'react-redux';
import { Tooltip } from 'antd';
import Lightbox from 'components/lightbox';
import nameMap from 'config/nameMap';
import { generateId } from 'utils/idGenerator';
import { checkProcessIsLoading } from 'utils/process';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import {
	copyBlockElem,
	deleteBlockElem,
	archiveCard,
	moveBlockElem,
} from 'actions/ui/card';
import {
	SubmitButton,
	GrayBorderButtonWhiteBackground,
} from 'share/styledComponents';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import { updateSortProcess } from 'actions/sort';
import {
	BlockElemContainer,
	BlockElemToolBarContainer,
	ToolButton,
} from './styledComponents';
import './style.css';

class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isHovering: false,
			lastData: false,
			deleteData: false,
		};
	}

	_lightboxHandleCancel = () => {
		this.setState({ lastData: false, deleteData: false });
		if (!this.props.commonMode && !isMobile) {
			this.props.lightboxClose();
		}
	};

	// 複製一筆資料段
	onTriggerCopyElem = () => {
		const { copyBlockElem, uniKey, blockType, elm, process } = this.props;
		const uidName = nameMap[blockType].uidName;
		const prvUID = elm[uidName];
		const newUID = generateId('tmp-copy');

		// 如果被複製的資料正進行非同步處理，忽略不處理
		if (!checkProcessIsLoading(process, prvUID)) {
			copyBlockElem(blockType, uniKey, prvUID, newUID);
		}
	};

	// 刪除一筆資料段
	onTriggerDeleteElem = () => {
		const { deleteBlockElem, uniKey, blockType, elm, process } = this.props;
		const uidName = nameMap[blockType].uidName;
		const uid = elm[uidName];

		// 如果被刪除的資料正進行非同步處理，忽略不處理
		if (!checkProcessIsLoading(process, uid)) {
			deleteBlockElem(blockType, uniKey, uid);
		}
	};

	// 刪除最後一筆資料 & 隱藏區塊提示
	showDeleteLastConfirm = () => {
		this.setState({ lastData: true, deleteData: false });
		if (this.props.commonMode && isMobile) {
			const confirmContent = window.confirm(
				'是否『刪除最後一筆資料並隱藏區塊』?'
			);
			confirmContent
				? this.onTriggetDeleteLastAndRemoveBlock()
				: this._lightboxHandleCancel();
		} else {
			this.props.lightboxOpen();
		}
	};

	// 刪除一筆資料
	showDeleteConfirm = () => {
		this.setState({ deleteData: true, lastData: false });
		if (this.props.commonMode && isMobile) {
			const confirmContent = window.confirm('刪除後資料將無法復原，確定繼續？');
			confirmContent
				? this.onTriggetDeleteData()
				: this._lightboxHandleCancel();
		} else {
			this.props.lightboxOpen();
		}
	};

	// 刪除最後一筆後隱藏區塊
	onTriggerRemoveBlock = () => {
		const { uniKey, archiveCard, blockType, templateType } = this.props;
		archiveCard(uniKey, blockType, templateType);
	};

	// 刪除最後一筆資料 & 隱藏區塊
	onTriggetDeleteLastAndRemoveBlock = () => {
		if (!this.props.commonMode && !isMobile) {
			this.props.lightboxClose();
		}
		this.onTriggerRemoveBlock();
		this.onTriggerDeleteElem();
	};

	// 刪除一筆資料跳提示視窗
	onTriggetDeleteData = () => {
		this.setState({ deleteData: false });
		if (!this.props.commonMode && !isMobile) {
			this.props.lightboxClose();
		}
		this.onTriggerDeleteElem();
	};

	// mobile 往上、往下移動位置(拖曳)
	onTriggerMobileElementMove = direction => {
		window.event.returnValue = false; // 減少畫面跳動
		const {
			uniKey,
			blockType,
			index,
			elm,
			moveBlockElem,
			updateSortProcess,
			changeSwitchTransition,
		} = this.props;
		const uidName = nameMap[blockType].uidName;
		const uid = elm[uidName];
		const sortType = fromJS(nameMap).getIn([blockType, 'sortType']);
		const nextIndex = direction === 'toTop' ? index - 1 : index + 1;
		changeSwitchTransition(
			direction === 'toTop' ? nextIndex : index,
			direction === 'toTop' ? index : nextIndex,
			index
		);
		setTimeout(() => {
			moveBlockElem(blockType, uniKey, uid, index, nextIndex);
			updateSortProcess(sortType, { blockType, uniKey });
		}, 600);
	};

	render() {
		const {
			toolBarType,
			elmDragSource,
			dataLength,
			blockType,
			displayFlex,
			editable,
			isUnSaved,
			elmDragPreview,
			index,
		} = this.props;
		const { lastData, deleteData } = this.state;

		// 無法編輯時不顯示
		if (!editable) return this.props.children;
		return (
			<Fragment>
				<BlockElemContainer
					toolBarType={toolBarType}
					displayFlex={displayFlex}
					className={`${blockType}-displayFlex ${
						isUnSaved ? 'unsave-hightlight' : ''
					}`}
				>
					<BlockElemToolBarContainer
						blockType={blockType}
						index={index}
						mobileLastData={dataLength}
					>
						<BrowserView style={{ display: 'inline-table' }}>
							{blockType !== 'experience' &&
								blockType !== 'education' &&
								elmDragSource &&
								elmDragSource(
									<span>
										<ToolButton position="first" vertical={false}>
											<Tooltip placement="bottom" title="按住拖動此筆資料">
												<FontIcon className={`icon-icon_touch_app`} />
											</Tooltip>
										</ToolButton>
									</span>
								)}
						</BrowserView>
						<MobileView style={{ display: 'inline-table' }}>
							{blockType !== 'experience' &&
								blockType !== 'education' &&
								blockType !== 'plus_activity' &&
								index !== 0 && (
									<ToolButton
										position="first"
										vertical={false}
										index={index}
										mobile={true}
										mobileLastData={dataLength}
									>
										<Tooltip
											placement="bottom"
											title="往上移此筆資料"
											trigger={isMobile ? 'click' : 'hover'}
										>
											<FontIcon
												className={`icon-arrow-up2`}
												onClick={
													index !== 0
														? this.onTriggerMobileElementMove.bind(
																this,
																'toTop'
														  )
														: ''
												}
											/>
										</Tooltip>
									</ToolButton>
								)}
							{blockType !== 'experience' &&
								blockType !== 'education' &&
								blockType !== 'plus_activity' &&
								index !== dataLength - 1 && (
									<ToolButton
										position="middle"
										vertical={false}
										index={index}
										mobile={true}
										mobileLastData={dataLength}
									>
										<Tooltip
											placement="bottom"
											title="往下移此筆資料"
											trigger={isMobile ? 'click' : 'hover'}
										>
											<FontIcon
												className={`icon-arrow-down2`}
												onClick={
													index !== dataLength - 1
														? this.onTriggerMobileElementMove.bind(
																this,
																'toBottom'
														  )
														: ''
												}
											/>
										</Tooltip>
									</ToolButton>
								)}
						</MobileView>
						{blockType !== 'plus_activity' && (
							<ToolButton
								position="middle"
								vertical={false}
								onClick={this.onTriggerCopyElem}
							>
								<Tooltip
									placement="bottom"
									title="複製此筆資料"
									trigger={isMobile ? 'click' : 'hover'}
								>
									<FontIcon className={`icon-icon_copy`} tooltip="複製" />
								</Tooltip>
							</ToolButton>
						)}
						<ToolButton position="last" vertical={false}>
							<Tooltip
								placement="bottom"
								title="刪除此筆資料"
								trigger={isMobile ? 'click' : 'hover'}
							>
								<FontIcon
									className={`icon-icon_cancel`}
									onClick={
										dataLength > 1
											? this.showDeleteConfirm
											: this.showDeleteLastConfirm
									}
								/>
							</Tooltip>
						</ToolButton>
					</BlockElemToolBarContainer>
					{blockType !== 'experience' &&
					blockType !== 'education' &&
					blockType !== 'plus_activity'
						? this.props.children(elmDragPreview)
						: this.props.children}
				</BlockElemContainer>
				{(lastData || deleteData) && (
					<Lightbox
						title="刪除資料"
						width="40%"
						onCancel={this._lightboxHandleCancel}
					>
						<div className="toolbar-lightbox-content">
							{lastData
								? '是否『刪除最後一筆資料並隱藏區塊』?'
								: '刪除後資料將無法復原，確定繼續？'}
						</div>
						<div className="toolbar-lightbox-button-main">
							<GrayBorderButtonWhiteBackground
								onClick={this._lightboxHandleCancel}
							>
								否
							</GrayBorderButtonWhiteBackground>
							<SubmitButton
								onClick={
									lastData
										? this.onTriggetDeleteLastAndRemoveBlock
										: this.onTriggetDeleteData
								}
							>
								是
							</SubmitButton>
						</div>
					</Lightbox>
				)}
			</Fragment>
		);
	}
}

const mapStateToPorps = (state, props) => ({
	templates: state.get('templates'),
	process: state.getIn(['process']),
});

export default connect(
	mapStateToPorps,
	{
		copyBlockElem,
		deleteBlockElem,
		archiveCard,
		lightboxOpen,
		lightboxClose,
		moveBlockElem,
		updateSortProcess,
	}
)(Toolbar);
