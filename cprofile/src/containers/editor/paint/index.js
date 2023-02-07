import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withRouter } from 'react-router-dom';
import { fromJS } from 'immutable';
import Toolbar from 'containers/toolbar/block';
import Template from 'templates';
import Promote from './promote';
import BlockUpdater from 'containers/blockUpdater';
import PlaceHolder from 'templates/placeHolder';
import Lightbox from 'components/lightbox';
import { changeHookProcessStatus } from 'actions/blocks';
import { addCard, removePlaceholder, removeExtraUniKey } from 'actions/ui/card';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { PLACEHOLDER_KEY } from 'actions/ui/card';
import { toggleReOrderConfirm } from 'actions/ui/reorder';
import {
	SubmitButton,
	GrayBorderButtonWhiteBackground,
} from 'share/styledComponents';
import './style.css';

const Description = styled.p`
	text-align: center;
	font-size: 20px;
	margin: 30px 0 46px;
`;

const ButtonContainer = styled.div`
	text-align: center;
	padding-top: 25px;
	border-top: 1px solid #dcdcdc;

	button:first-child {
		margin-right: 10px;
	}
`;

class Paint extends PureComponent {
	static defaultProps = {
		editable: true,
	};

	constructor(props) {
		super(props);
		this.state = {
			showMode: 'full',
			device: 'pc',
		};
	}

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.showConfirmReOrder !== this.props.showConfirmReOrder) {
			this.props.showConfirmReOrder
				? this.props.lightboxOpen()
				: this.props.lightboxClose();
		}

		this.props.list.forEach(uniKey => {
			if (
				uniKey !== PLACEHOLDER_KEY &&
				(!this.props.data.get(uniKey) || !this.props.config.get(uniKey))
			) {
				this.props.removeExtraUniKey(uniKey);
			}
		});
	};

	// 確認 or 取消重新排序
	handleConfirmReOrder = comfirmed => {
		this.props.toggleReOrderConfirm(false);
		if (comfirmed) {
			this.props.changeHookProcessStatus('shouldUpdateData', 'continue');
		}
	};

	// 區塊列表
	renderList = () => {
		const list = this.props.list.toJS();
		const { plusActivity } = this.props;
		// 空狀態
		if (!list.length) {
			return this.props.editable ? <Promote /> : null;
		}

		// 有資料
		const blocksList = list.map((uniKey, idx) => {
			// placeholder
			if (uniKey === PLACEHOLDER_KEY) {
				return this.props.editable ? (
					<CSSTransition
						key={PLACEHOLDER_KEY}
						{...{ classNames: '', timeout: { enter: 0, exit: 0 } }}
					>
						<Toolbar
							config={{ blockType: PLACEHOLDER_KEY, uniKey: PLACEHOLDER_KEY }}
							meta={{ editable: true, index: idx }}
						>
							<PlaceHolder text="拖曳中的區塊將被放置在此" />
						</Toolbar>
					</CSSTransition>
				) : null;
			}

			// 一般區塊
			if (!this.props.data.get(uniKey) || !this.props.config.get(uniKey))
				return null;

			const data = this.props.data.get(uniKey).toJS();
			const config = this.props.config.get(uniKey).toJS();

			// 如果已經匯入了plus文章區塊也已拉進profile，但尚未轉擋的情況下，畫面會顯示有區塊空資料
			// 此判斷為未轉擋卻有拉進profile的情況
			if (config.blockType === 'plus_activity' && !plusActivity) {
				return null;
			}

			return this.props.editable ? (
				<CSSTransition
					{...{
						key: uniKey,
						classNames: 'fade',
						timeout: { enter: 300, exit: 1000 },
					}}
				>
					<Toolbar config={config} meta={{ editable: true, index: idx }}>
						<BlockUpdater config={config}>
							{meta => (
								<Template
									data={data}
									config={config}
									meta={meta}
									commonMode={this.props.commonMode}
								/>
							)}
						</BlockUpdater>
					</Toolbar>
				</CSSTransition>
			) : (
				<Template
					key={uniKey}
					data={data}
					config={config}
					commonMode={this.props.commonMode}
				/>
			);
		});

		return this.props.editable ? (
			<TransitionGroup>{blocksList}</TransitionGroup>
		) : (
			blocksList
		);
	};

	render() {
		const { theme, visible, config, data, themeUi } = this.props;
		const { device } = this.state;
		const menubarStatus =
			visible || themeUi
				? 'paint-wrapper-menubar-open'
				: 'paint-wrapper-menubar-close';
		const basicConfig =
			config.find(data => data.get('blockType') === 'basic') || fromJS({});
		const basicTemplate = basicConfig.get('templateType') || '';
		const blockData = data.get(basicConfig.get('uniKey')) || fromJS({});

		return (
			<div className={`paint-wrapper ${theme} ${device} ${menubarStatus}`}>
				{this.props.showConfirmReOrder && (
					<Lightbox
						title="重新排序確認"
						width="40%"
						onCancel={this.handleConfirmReOrder.bind(this, false)}
					>
						<Description>
							這個操作會改變當前區塊資料的排序，請問您是否要繼續?
						</Description>
						<ButtonContainer>
							<GrayBorderButtonWhiteBackground
								onClick={this.handleConfirmReOrder.bind(this, false)}
							>
								取消
							</GrayBorderButtonWhiteBackground>
							<SubmitButton
								onClick={this.handleConfirmReOrder.bind(this, true)}
							>
								繼續
							</SubmitButton>
						</ButtonContainer>
					</Lightbox>
				)}
				<div
					className={`user-data user-${basicTemplate}`}
					id={basicConfig.get('uniKey')}
				>
					<BlockUpdater config={basicConfig.toJS()}>
						{meta => (
							<Template
								data={blockData.toJS()}
								config={basicConfig.toJS()}
								meta={meta}
							/>
						)}
					</BlockUpdater>
				</div>
				<div className="paint-container">{this.renderList()}</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	list: state.get('blocksList'),
	data: state.get('data'),
	config: state.get('config'),
	isDragging: state.getIn(['ui', 'blocksList', 'isDragging']),
	isScrolling: state.getIn(['ui', 'blocksList', 'isScrolling']),
	scrollDirection: state.getIn(['ui', 'blocksList', 'scrollDirection']),
	theme: state.getIn(['ui', 'factory', 'theme']),
	visible: state.getIn(['ui', 'menubar', 'visible']),
	themeUi: state.getIn(['ui', 'menubar', 'theme']),
	showConfirmReOrder: state.getIn(['ui', 'reorder', 'visibility']),
	plusActivity: state.getIn(['ui', 'plusActivity', 'hasPlusActivity']),
});

export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{
			addCard,
			removePlaceholder,
			removeExtraUniKey,
			changeHookProcessStatus,
			lightboxOpen,
			lightboxClose,
			toggleReOrderConfirm,
		}
	)
)(Paint);
