import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Icon } from 'antd';
import { compose } from 'recompose';
import Lightbox from '../lightbox';
import { updateCard, addCard } from 'actions/ui/card';
import {
	requestCreateConnectorSnapshot,
	requestFetchConnectorRawData,
	updateConnectorStatus,
} from 'actions/blocks/connector';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { changeShowTag } from 'actions/ui/factory';
import uuidv4 from 'uuid/v4';
import hint from 'components/defaultSmallImage/behance_hint.png';
import withScrollAnchor from 'containers/scrollAnchor';
import {
	SubmitButton,
	DisabledSubmitButton,
	GrayBorderButtonWhiteBackground,
} from 'share/styledComponents';
import { BehanceBlockTitle, BehanceBlockDescription } from './styledComponents';
import './style.css';

// antd Icon 的 API 只支援 style，無支援 className
const check_icon = {
	width: '26px',
	height: '26px',
	boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.5)',
	backgroundColor: '#f5b523',
	border: 'solid 1px #fff',
	color: '#fff',
	borderRadius: '50%',
	fontSize: '18px',
	lineHeight: '1.5',
	right: '5px',
	top: '2px',
	position: 'absolute',
};

class BehanceRepo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			behanceSelectAllCheckbox: false,
			checkedStatus: [],
			behanceAcError: false, // 帳號是否錯誤
		};
	}

	/* 要傳到後端的module格式 */
	_updateModule = elm => {
		let projectModule = {
			projectAppreciations: 0,
			projectComments: 0,
			projectCover_115: 'string',
			projectCover_202: 'string',
			projectCover_230: 'string',
			projectCover_404: 'string',
			projectCover_original: 'string',
			projectFields: ['string'],
			projectName: 'string',
			projectURL: 'string',
			projectViews: 0,
		};
		projectModule.projectAppreciations = elm.stats.appreciations;
		projectModule.projectComments = elm.stats.comments;
		projectModule.projectCover_115 = elm.covers[115];
		projectModule.projectCover_202 = elm.covers[202];
		projectModule.projectCover_230 = elm.covers[230];
		projectModule.projectCover_404 = elm.covers[404];
		projectModule.projectCover_original = elm.covers.original;
		projectModule.projectFields = elm.fields;
		projectModule.projectName = elm.name;
		projectModule.projectURL = elm.url;
		projectModule.projectViews = elm.stats.views;
		return projectModule;
	};

	/* 關閉lightbox */
	_lightboxHandleCancel = () => {
		this.setState({ behanceAcError: false });
		this.props.updateConnectorStatus('behance', {
			rawData: null,
			errorMessage: null,
		});
		this.props.lightboxClose();
	};

	/* behance去認證 */
	_behanceConnect = () => {
		const key = this._input.value;
		this.setState({ behanceAcError: false });
		this.props.updateConnectorStatus('behance', { errorMessage: '' });
		if (key) {
			setTimeout(() => {
				this.props.requestFetchConnectorRawData('behance', {
					key: key,
					pid: this.props.user.pid,
				});
			}, 100);
		} else {
			this.setState({ behanceAcError: true });
		}
	};

	/* 全部選取Checkbox */
	_behanceSelectAll = e => {
		const { connectorBehance } = this.props;
		const { projects } = connectorBehance.toJS().rawData;
		let selectAll = [];
		if (e.target.checked) projects.map((list, index) => selectAll.push(index));
		this.setState({
			checkedStatus: selectAll,
			behanceSelectAllCheckbox: e.target.checked,
		});
	};

	/* 單選取behance區塊 */
	_pushSelect = index => {
		const { connectorBehance } = this.props;
		const { projects } = connectorBehance.toJS().rawData;
		let checkedArray = this.state.checkedStatus;

		if (checkedArray.indexOf(index) === -1) {
			checkedArray.push(index);
		} else {
			checkedArray = checkedArray.filter(arr => arr !== index);
		}

		this.setState({
			checkedStatus: checkedArray,
			behanceSelectAllCheckbox:
				checkedArray.length === projects.length ? true : false,
		});
	};

	/* 選取確認 */
	_behanceSubmit = () => {
		if (this.props.connectorBehance.toJS().rawData.projects.length < 1)
			return this._lightboxHandleCancel();
		const {
			addCard,
			updateCard,
			config,
			requestCreateConnectorSnapshot,
			blocksList,
			changeShowTag,
			connectorBehance,
		} = this.props;
		const { projects } = connectorBehance.toJS().rawData;
		const selected = projects.filter(
			(item, index) => this.state.checkedStatus.indexOf(index) !== -1
		);
		let projectData = [];

		selected.forEach((list, index) => {
			let projectObj = this._updateModule(list);
			projectData.push(projectObj);
		});

		const targetUniKey = config && config.uniKey ? config.uniKey : uuidv4();
		const snapshotModule = {
			pid: this.props.user.pid,
			projectList: projectData,
			type: 'BEHANCE',
		};

		requestCreateConnectorSnapshot('behance', snapshotModule);
		addCard('behance', targetUniKey, blocksList.toJS().length, 'def');
		updateCard(targetUniKey, snapshotModule);
		changeShowTag('behance');
		this._lightboxHandleCancel();
		setTimeout(() => {
			this.props.scrollToAnchor(targetUniKey);
		}, 100);
	};

	_renderContent = () => {
		let status;
		const {
			behanceSelectAllCheckbox,
			checkedStatus,
			behanceAcError,
		} = this.state;
		const {
			connectorBehance,
			updateConnectorStatus,
			closeBehanceRepo,
		} = this.props;
		const {
			hasToken,
			hasSnapshot,
			rawData,
			errorMessage,
		} = connectorBehance.toJS();
		if (
			!hasSnapshot &&
			rawData &&
			rawData.projects &&
			rawData.projects.length < 1
		)
			status = 'noRawData';
		if (
			hasSnapshot &&
			rawData &&
			rawData.projects &&
			rawData.projects.length < 1
		)
			status = 'reImportNoRawData';
		if (
			hasToken &&
			!hasSnapshot &&
			rawData &&
			rawData.projects &&
			rawData.projects.length > 0
		)
			status = 'hasRawData';
		if (
			hasToken &&
			hasSnapshot &&
			rawData &&
			rawData.projects &&
			rawData.projects.length > 0
		)
			status = 'reImportHasRawData';
		if (hasToken && !hasSnapshot && errorMessage === 'invalidId')
			status = 'behanceError';
		if (
			hasToken &&
			!hasSnapshot &&
			rawData &&
			rawData.http_code &&
			rawData.http_code === 500
		)
			status = 'httpCodeError';
		if (hasToken && hasSnapshot && errorMessage === 'invalidId')
			status = 'reImportBehanceError';

		switch (status) {
			case 'hasRawData':
			case 'reImportHasRawData':
				return (
					<Fragment>
						{rawData && rawData.projects && rawData.projects.length > 0 && (
							<Fragment>
								<div>
									<Checkbox
										onChange={this._behanceSelectAll}
										checked={behanceSelectAllCheckbox}
									>
										全部選取
									</Checkbox>
								</div>
								<div className="behance_outer_layer">
									{rawData.projects.map((elm, index) => {
										const { name, covers, fields, stats } = elm;
										return (
											<div
												key={index}
												className={
													checkedStatus.indexOf(index) !== -1
														? `behance-block-main-four isCheck`
														: 'behance-block-main-four'
												}
												onClick={this._pushSelect.bind(this, index)}
											>
												{checkedStatus.indexOf(index) !== -1 && (
													<Icon type="check" style={check_icon} />
												)}
												<img
													src={covers[404]}
													className="behance-block-img"
													alt={name}
												/>
												<BehanceBlockTitle>{name}</BehanceBlockTitle>
												<BehanceBlockDescription>
													{fields[0]}
												</BehanceBlockDescription>
												<div className="behance-block-hide-footer" />
												<div className="behance-block-footer">
													<span>
														<i className="icon-icon_favorite" />{' '}
														{stats.appreciations}
													</span>
													<span>
														<i className="icon-icon_dialogue" />{' '}
														{stats.comments}
													</span>
													<span>
														<i className="icon-icon-icon_watching" />{' '}
														{stats.views}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</Fragment>
						)}
						<div className="white_gradient" />
						<div className="behance-button">
							{checkedStatus.length > 0 ? (
								<SubmitButton onClick={this._behanceSubmit}>確認</SubmitButton>
							) : (
								<DisabledSubmitButton>確認</DisabledSubmitButton>
							)}
						</div>
					</Fragment>
				);

			case 'noRawData':
			case 'reImportNoRawData':
			case 'behanceError':
			case 'httpCodeError':
				return (
					<div className="behance_outer_layer_no_work">
						<div>此帳號在 Behance 上並無作品，是否要輸入其他帳號？</div>
						<input
							className="behance_input no-work"
							placeholder="重新輸入 Behance 帳號"
							ref={_ref => (this._input = _ref)}
						/>
						{(behanceAcError ||
							(errorMessage && errorMessage === 'invalidId')) && (
							<div className="behance_error_ac">
								您所輸入的帳號無法匯入資料，請確認帳號是否有誤，並重新輸入
							</div>
						)}
						<div className="behance_input_no_work_button">
							<GrayBorderButtonWhiteBackground
								onClick={() => {
									updateConnectorStatus('behance', { errorMessage: null });
									closeBehanceRepo();
								}}
							>
								取消新增樣板
							</GrayBorderButtonWhiteBackground>
							<SubmitButton onClick={this._behanceConnect}>
								重新匯入作品
							</SubmitButton>
						</div>
					</div>
				);

			default:
				return (
					<div className="behance_certified_main">
						<div>
							<img src={hint} alt="behance" />
						</div>
						<div className="behance-authorize">請授權匯入你的 Behance 作品</div>
						<input
							className="behance_input"
							placeholder="請參考上圖在此輸入你的 Behance 帳號"
							ref={_ref => (this._input = _ref)}
						/>
						{(behanceAcError ||
							(errorMessage && errorMessage === 'invalidId')) && (
							<div className="behance_error_ac">
								您所輸入的帳號無法匯入資料，請確認帳號是否有誤，並重新輸入
							</div>
						)}
						<div className="behance-button">
							<SubmitButton onClick={this._behanceConnect}>
								匯入我的作品
							</SubmitButton>
						</div>
					</div>
				);
		}
	};

	render() {
		const {
			closeBehanceRepo,
			connectorBehance,
			updateConnectorStatus,
		} = this.props;
		const {
			hasToken,
			hasSnapshot,
			rawData,
			errorMessage,
		} = connectorBehance.toJS();
		const noRawData =
			!hasSnapshot &&
			rawData &&
			rawData.projects &&
			rawData.projects.length < 1;
		const reImportNoRawData =
			(hasToken && hasSnapshot && !rawData) ||
			(hasToken &&
				hasSnapshot &&
				rawData &&
				rawData.projects &&
				rawData.projects.length < 1);
		const behanceError =
			hasToken && !hasSnapshot && errorMessage === 'invalidId';
		const httpCodeError =
			hasToken &&
			!hasSnapshot &&
			rawData &&
			rawData.http_code &&
			rawData.http_code === 500
				? true
				: false;
		const reImporthttpCodeError =
			hasToken &&
			hasSnapshot &&
			rawData &&
			rawData.http_code &&
			rawData.http_code === 500
				? true
				: false;

		return (
			<Lightbox
				title={
					hasToken && rawData && rawData.projects && rawData.projects.length > 0
						? '選取 Behance 要顯示的作品'
						: '輸入 Behance 帳號'
				}
				onCancel={this._lightboxHandleCancel}
				afterClose={() => {
					updateConnectorStatus('behance', { errorMessage: null });
					closeBehanceRepo();
				}}
				cssClassName="behanceLightbox"
				width={
					!hasToken ||
					(hasToken && noRawData) ||
					reImportNoRawData ||
					httpCodeError ||
					reImporthttpCodeError ||
					behanceError
						? '580px'
						: '977px'
				}
			>
				{this._renderContent()}
			</Lightbox>
		);
	}
}

const mapStateToPorps = (state, props) => ({
	blocksList: state.get('blocksList'),
	config: state.get('config').find(elm => elm.get('blockType') === 'behance'),
	connectorBehance: state.getIn(['connector', 'behance']),
});

const actions = {
	updateCard,
	addCard,
	requestCreateConnectorSnapshot,
	requestFetchConnectorRawData,
	updateConnectorStatus,
	lightboxOpen,
	lightboxClose,
	changeShowTag,
};

export default compose(
	connect(
		mapStateToPorps,
		actions
	),
	withScrollAnchor
)(BehanceRepo);
