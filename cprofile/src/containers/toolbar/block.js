import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-sticky-el';
import styled from 'styled-components';
import FontIcon from 'material-ui/FontIcon';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Tooltip, Icon } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import { throttle } from 'lodash';
import TalentRatingDescription from 'components/talentRatingDescription';
import RequiredDescriptionIcon from 'components/requiredDescriptionIcon';
import ReorderDescription from 'components/reorderDescription';
import nameMap from 'config/nameMap';
import { generateId } from 'utils/idGenerator';
import { changeShowTag } from 'actions/ui/factory';
import { menubarOpen } from 'actions/ui/menubar';
import { pushSystemMessage } from 'actions/ui/systemMessage';
import { updateSortProcess } from 'actions/sort';
import { PLACEHOLDER_KEY } from 'actions/ui/card';
import { toggleBlocksListDrag } from 'actions/ui/blocksList';
import githubLogo from 'components/defaultSmallImage/PbyGithub.png';
import behanceLogo from 'components/defaultSmallImage/PbyBehance-horizontal.png';
import { withDelayRender } from 'containers/toolbar/workaround';
import PlaceHolder from 'templates/placeHolder';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import MobileBlockToolBar from 'components/mobileBlockToolBar';
import { toolbarPromptEnd } from 'actions/ui/noviceGuide';
import {
	moveCard,
	addCard,
	archiveCard,
	addBlockElem,
	injectPlaceholder,
} from 'actions/ui/card';
import './style.css';

/**
 * Dnd Setting for BLOCK
 */
export const BLOCK_DRAG_TYPE = 'BLOCK';
const BlockSourceOption = {
	beginDrag(props, monitor, component) {
		props.toggleBlocksListDrag(true, props.meta.index);

		// 這個不會隨著拖曳過程中而更新
		return props;
	},
	endDrag(props, monitor) {
		props.toggleBlocksListDrag(false);

		if (monitor.didDrop()) {
			props.updateSortProcess('BLOCK');
		}
	},
	isDragging(props, monitor) {
		const dragTarget = monitor.getItem();
		const hoverTarget = props;
		return dragTarget.config.uniKey === hoverTarget.config.uniKey;
	},
};

const BlockSourceCollect = (connect, monitor) => ({
	connectBlockDragSource: connect.dragSource(),
	connectBlockDragPreview: connect.dragPreview(),
	blockIsDragging: monitor.isDragging(),
});

const BlockTargetOption = {
	hover: throttle((props, monitor, component) => {
		const dragTarget = monitor.getItem(); // 直到拖曳結束都不會更新
		const hoverTarget = props; // 會隨時更新

		const dragIndex = props.dragIndex;
		const hoverIndex = props.meta.index;

		// 放開的瞬間會跑一次 null
		if (!dragTarget || !monitor.getClientOffset()) return;
		if (dragTarget.config.uniKey === hoverTarget.config.uniKey) return;
		if (dragIndex === hoverIndex) return; // dragTarget 不會隨著拖曳而更新

		// 判定 hover 超過區塊一半才交換
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
		const hoverBoundaryHeight =
			hoverBoundingRect.bottom - hoverBoundingRect.top;
		const exchangeThread = hoverBoundaryHeight * 0.5;
		const clientOffset = monitor.getClientOffset();
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		if (dragIndex < hoverIndex && hoverClientY < exchangeThread) return;
		if (
			dragIndex > hoverIndex &&
			hoverClientY >= hoverBoundaryHeight - exchangeThread
		)
			return;

		props.moveCard(dragTarget.config.uniKey, hoverIndex);
	}, 100),
};

const BlockTargetCollect = (connect, monitor) => ({
	connectBlockDropTarget: connect.dropTarget(),
	blockCanDrop: monitor.canDrop(),
	blockIsHovering: monitor.isOver(),
});

/**
 * Dnd Setting for TEMPLATE
 */
export const TEMPLATE_DRAG_TYPE = 'TEMPLATE';
const TemplateTargetOption = {
	drop(props, monitor, component) {
		const dragTarget = monitor.getItem();
		const hoverIndex = props.meta.index;
		// 為了讓插入的區塊顯示原本樣貌，這邊提早發終止 drag
		props.toggleBlocksListDrag(false);
		props.addCard(
			dragTarget.blockType,
			dragTarget.uniKey,
			hoverIndex,
			dragTarget.templateType,
			dragTarget.needCreate
		);
	},
	hover: throttle((props, monitor, component) => {
		const dragTarget = monitor.getItem(); // 直到拖曳結束都不會更新
		const hoverTarget = props; // 會隨時更新
		const hoverIndex = props.meta.index;
		// 放開的瞬間會跑一次 null
		if (!dragTarget || !monitor.getClientOffset()) return;

		// 在 placeholder 上面
		if (hoverTarget.config.uniKey === PLACEHOLDER_KEY) return;

		// 判定 hover 區塊的上半部或下半部
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
		const clientOffset = monitor.getClientOffset();
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		const index =
			hoverClientY < hoverMiddleY
				? hoverIndex // 區塊的上半部
				: hoverIndex + 1; // 區塊的下半部

		// 減少重複插入 placeholder 的判斷
		if (props.placeholderIndex === hoverIndex) return;
		if (props.placeholderIndex === index) return;

		props.injectPlaceholder(index);
	}, 100),
};

const TemplateTargetCollect = (connect, monitor) => ({
	connectTemplateDropTarget: connect.dropTarget(),
	templateCanDrop: monitor.canDrop(),
});

/**
 * Style
 */
const Container = styled.div`
	display: hidden;
	border-radius: 6px;
	position: relative;
	border-style: solid;
	border-width: 3px;
	border-color: ${props => (props.toolbarPrompt ? '#f7f7f7' : 'transparent')};

	:hover {
		display: shown;
		border-color: #f7f7f7;
	}

	@media (max-width: 960px) {
		width: 95%;
		margin: 0 auto;
	}
`;

const ToolBarContainer = styled.div`
	display: ${props => (props.toolbarPrompt ? 'block' : 'none')};
	position: absolute;
	z-index: 2;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	background: #f7f7f7;
	color: #fff !important;
	top: calc(100% + 20px);
	right: -25px;

	${Container}:hover & {
		display: block;
	}
`;

const ToolButton = styled.div`
	cursor: pointer;
	padding: 8px;
	vertical-align: middle;
	width: 45px;
	text-align: center;
	display: ${props => (props.vertical ? 'block' : 'inline-block')};
	border-right: ${props =>
		!props.vertical && props.position !== 'last' ? '1px solid #eaeaea' : '0'};

	&::after {
		${props =>
			props.vertical && props.position !== 'last' ? `content: '';` : ''};
		${props =>
			props.vertical && props.position !== 'last'
				? `background-color: #B9B9B9;`
				: ''};
		width: 18px;
		height: 2px;
		display: block;
		margin: 8px auto 4px auto;
		position: absolute;
		left: calc((45px / 2) - 8px);
	}

	:hover {
		.icon-icon_touch_app::before,
		.icon-icon_hibe::before,
		.icon-icon_quick_tools::before,
		i {
			opacity: 0.7;
		}
	}

	/* Custom Icon Style */
	[class^='icon-'],
	[class^='icon-']::before,
	span {
		color: #484848 !important;
		font-size: 18px;
	}
	.icon-icon_touch_app::before {
		font-size: 32px;
	}
	.icon-icon_hibe::before {
		font-size: 32px;
	}
	.icon-icon_quick_tools::before {
		font-size: 32px;
	}
`;

const ResumesWithHint = styled.span`
	content: '';
	position: absolute;
	top: -6px;
	right: -6px;
	display: block;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-clip: padding-box;
	background-color: #3097ff;
	border: 1px solid hsla(0, 0%, 100%, 0.2);
	-webkit-box-shadow: 0 0 0 rgba(48, 151, 255, 0.2);
	box-shadow: 0 0 0 rgba(48, 151, 255, 0.2);
	-webkit-animation: hint-animation 2s infinite;
	animation: hint-animation 2s infinite;

	@keyframes hint-animation {
		0% {
			background-color: #3097ff;
			-webkit-box-shadow: 0 0 0 0 rgba(48, 151, 255, 0.7);
			box-shadow: 0 0 0 0 rgba(48, 151, 255, 0.7);
		}
		70% {
			background-color: rgba(48, 151, 255, 0.65);
			-webkit-box-shadow: 0 0 0 18px transparent;
			box-shadow: 0 0 0 18px transparent;
		}
		95% {
			background-color: rgba(48, 151, 255, 0.65);
		}
		to {
			background-color: rgba(48, 151, 255, 0.85);
			-webkit-box-shadow: 0 0 0 0 transparent;
			box-shadow: 0 0 0 0 transparent;
		}
	}
`;

/**
 * 自訂區塊拖曳時的 drag preview
 */
export const BlockTitle = ({
	blockType,
	visibility,
	editable,
	templateType,
}) => {
	if (!visibility) return null;
	const showNotification = ['honor', 'gallery'].indexOf(blockType) !== -1;
	const showRatingDescription = blockType === 'talent';
	const showGithubLogo = blockType === 'github';
	const showBehanceLogo = blockType === 'behance';
	const showReorderDescription =
		['experience', 'education'].indexOf(blockType) !== -1;
	return (
		<div className="block-title">
			<span className="block-title-dash" />
			<h3>{nameMap[blockType].name}</h3>
			{showNotification && editable && (
				<RequiredDescriptionIcon
					blockType={blockType}
					templateType={templateType}
				/>
			)}
			{showRatingDescription && <TalentRatingDescription />}
			{showGithubLogo && (
				<BrowserView>
					<img src={githubLogo} className="github-banner" alt="github" />
				</BrowserView>
			)}
			{showBehanceLogo && (
				<BrowserView>
					<img src={behanceLogo} className="behance-banner" alt="Behance" />
				</BrowserView>
			)}
			{showReorderDescription && <ReorderDescription blockType={blockType} />}
		</div>
	);
};

BlockTitle.defaultProps = {
	visibility: true,
};
BlockTitle.propTypes = {
	blockType: PropTypes.string.isRequired,
	visibility: PropTypes.bool,
};

/**
 * 區塊工具列
 */
class BlockToolbar extends Component {
	static defaultProps = {
		meta: {
			editable: false,
			isUnSaved: false,
		},
	};

	static propsTypes = {
		index: PropTypes.number.isRequired,
		config: PropTypes.object.isRequired,
		meta: PropTypes.shape({
			editable: PropTypes.bool.isRequired,
			isUnSaved: PropTypes.bool.isRequired,
		}).isRequired,
	};

	state = {
		visible: false,
	};

	componentDidMount = () => {
		// 因為要自定義 drag preview render，這裡用空圖片讓他不會顯示
		this.props.connectBlockDragPreview(getEmptyImage(), {
			captureDraggingState: true,
		});
	};

	// handler，新增一筆資料段
	onTriggerAddElem = () => {
		const { uniKey, blockType, templateType } = this.props.config;
		const newUID = generateId('tmp-new');
		this.props.addBlockElem(blockType, uniKey, newUID, templateType);
	};

	// handler，觸發左側顯示模板選擇
	onTriggerShowMenu = () => {
		const { menubarOpen, changeShowTag, config } = this.props;
		menubarOpen();
		changeShowTag(config.blockType);
	};

	// handler，隱藏區塊
	onTriggerRemoveBlock = () => {
		const { uniKey, blockType, templateType } = this.props.config;
		this.props.archiveCard(uniKey, blockType, templateType);
		this.props.pushSystemMessage(
			'此區塊已隱藏，點擊左側選單可再顯示區塊唷！',
			'info'
		);
	};

	// 顯示區塊 or placeholder
	renderContent = () => {
		// custom 不顯示區塊標題
		const { config, dragIndex, meta, children } = this.props;
		const hideShowMenuButton = ['custom'].indexOf(config.blockType) === -1;
		let showBlockTitle = config.blockType === 'custom' ? false : true;
		let showPlaceholder = dragIndex === meta.index;

		return (
			<div
				id={config.uniKey}
				className={`block-wrapper ${config.blockType}-${config.templateType} ${
					showPlaceholder && !isMobile ? 'promote' : ''
				}`}
			>
				<BrowserView>
					{showPlaceholder ? (
						<PlaceHolder text="拖曳中的區塊將被放置在此" />
					) : (
						<Fragment>
							<BlockTitle
								blockType={config.blockType}
								visibility={showBlockTitle}
								editable={meta.editable}
								templateType={config.templateType}
							/>
							{children}
						</Fragment>
					)}
				</BrowserView>
				<MobileView>
					{hideShowMenuButton && (
						<div className="mobile-toolbar-main">
							<div className="mobile-toolbar-left-title">
								<BlockTitle
									blockType={config.blockType}
									visibility={showBlockTitle}
									editable={meta.editable}
									templateType={config.templateType}
								/>
							</div>
							<div className="mobile-toolbar-menu">
								<MobileBlockToolBar config={config} />
							</div>
						</div>
					)}
					{children}
				</MobileView>
			</div>
		);
	};

	handleVisibleChange = visible => {
		this.setState({
			visible,
		});
	};

	handleToolbarPrompt = () => {
		if (this.props.toolbarPrompt) this.props.toolbarPromptEnd();
	};

	render() {
		const {
			meta,
			config,
			connectBlockDragSource,
			connectTemplateDropTarget,
			connectBlockDropTarget,
			toolbarPrompt,
		} = this.props;

		// 無法編輯時不顯示
		if (!meta.editable) return this.renderContent();

		const isUnSaved =
			/tmp-/.test(config.uniKey) && config.blockType === 'custom';
		const hideAddElemButton =
			['custom', 'github', 'behance', 'plus_activity'].indexOf(
				config.blockType
			) === -1;
		const hideShowMenuButton = ['custom'].indexOf(config.blockType) === -1;

		return (
			<Fragment>
				<BrowserView>
					<Container
						className={`toolbar-all toolbar-${config.blockType} ${
							isUnSaved ? 'unsave-hightlight' : ''
						}`}
						toolbarPrompt={toolbarPrompt}
						onMouseLeave={this.handleToolbarPrompt}
					>
						<Sticky
							boundaryElement={`.toolbar-all`}
							style={{ position: 'relative', zIndex: '10' }}
							topOffset={-45}
							bottomOffset={280}
							hideOnBoundaryHit={true}
						>
							<ToolBarContainer toolbarPrompt={toolbarPrompt}>
								{toolbarPrompt && <ResumesWithHint />}
								{hideAddElemButton && (
									<ToolButton position="middle" vertical={true}>
										<Tooltip placement="right" title="新增一筆資料">
											<Icon
												type={`plus-circle`}
												style={{
													color: '#f5b523',
													fontSize: '20px',
													padding: '8px 6px',
												}}
												onClick={this.onTriggerAddElem}
											/>
										</Tooltip>
									</ToolButton>
								)}
								{connectBlockDragSource(
									<div>
										<ToolButton position="first" vertical={true} last={false}>
											<Tooltip placement="right" title="按住拖動此區塊資料">
												<FontIcon className={`icon-icon_touch_app`} />
											</Tooltip>
										</ToolButton>
									</div>
								)}
								{hideShowMenuButton && (
									<ToolButton position="middle" vertical={true} last={false}>
										<Tooltip placement="right" title="更換樣式">
											<FontIcon
												className={`icon-icon_quick_tools`}
												onClick={this.onTriggerShowMenu}
											/>
										</Tooltip>
									</ToolButton>
								)}
								<ToolButton position="last" vertical={true} last={true}>
									<Tooltip placement="right" title="隱藏此區塊">
										<FontIcon
											className={`icon-icon_hibe`}
											onClick={this.onTriggerRemoveBlock}
										/>
									</Tooltip>
								</ToolButton>
							</ToolBarContainer>
						</Sticky>
						{connectTemplateDropTarget(
							connectBlockDropTarget(this.renderContent())
						)}
					</Container>
				</BrowserView>
				<MobileView>{this.renderContent()}</MobileView>
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	user: state.get('user'),
	dataEntity: state.get('data'),
	templates: state.get('templates'),
	process: state.getIn(['process']),
	placeholderIndex: state
		.get('blocksList')
		.findIndex(key => key === PLACEHOLDER_KEY),
	isDragging: state.getIn(['ui', 'blocksList', 'isDragging']),
	dragIndex: state.getIn(['ui', 'blocksList', 'dragIndex']),
	toolbarPrompt: state.getIn(['ui', 'noviceGuide', 'toolbarPromptStart']),
});

export default compose(
	connect(
		mapStateToProps,
		{
			addCard,
			moveCard,
			archiveCard,
			addBlockElem,
			injectPlaceholder,
			toggleBlocksListDrag,
			changeShowTag,
			menubarOpen,
			pushSystemMessage,
			updateSortProcess,
			toolbarPromptEnd,
		}
	),
	DragSource(BLOCK_DRAG_TYPE, BlockSourceOption, BlockSourceCollect),
	DropTarget(BLOCK_DRAG_TYPE, BlockTargetOption, BlockTargetCollect),
	DropTarget(TEMPLATE_DRAG_TYPE, TemplateTargetOption, TemplateTargetCollect),
	withDelayRender
)(BlockToolbar);
