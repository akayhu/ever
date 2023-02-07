import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { Icon, Checkbox } from 'antd';
import { logout } from 'actions/user';
import {
	requestImportServiceStatus,
	requestImportServiceDetail,
	importProcess,
	validServiceName,
} from 'actions/blocks/import';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { checkProcessIsLoading, checkProcessIsDone } from 'utils/process';
import Lightbox from 'components/lightbox';
import {
	LightboxLoading,
	Loading,
	SubmitButton,
	DisabledSubmitButton,
	GrayBorderButton,
	GrayBorderButtonWhiteBackground,
} from 'share/styledComponents';
import { withRouter } from 'react-router';
import nameMap from 'config/nameMap';
import './style.css';
import my104Icon from 'components/defaultSmallImage/icon-104-resume.png';
import iconNew from 'components/defaultSmallImage/icon-new-resume.png';
import LightboxWrongCopy from 'components/lightboxWrongCopy';

// antd Icon 的 API 只支援 style，無支援 className
const check_icon = {
	width: '37px',
	height: '36px',
	boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.5)',
	backgroundColor: '#f5b523',
	border: 'solid 1px #fff',
	color: '#fff',
	borderRadius: '50%',
	fontSize: '24px',
	lineHeight: '1.5',
	right: '-16px',
	top: '-16px',
	position: 'absolute',
};

class Import extends Component {
	constructor(props) {
		super(props);
		this.serviceMap = {
			my104: {
				name: '104 人力銀行 個人履歷',
				icon: my104Icon,
			},
		};
		this.state = {
			selectedBlocks: fromJS([]), // 已選擇要匯入的區塊
			replaceAlertBlocks: fromJS([]), // 覆蓋顯示的區塊
			selectedService: '', // 已選擇的匯入服務
			showChooseImportBlocks: false, // true 顯示選擇匯入區塊
		};
	}

	componentDidMount = () => {
		const {
			pid,
			process,
			requestImportServiceStatus,
			lightboxOpen,
		} = this.props;
		const isFetchAllServiceStatusDone = validServiceName.every(serviceName =>
			checkProcessIsDone(process, serviceName, 'importServiceStatus')
		);
		if (!isFetchAllServiceStatusDone) {
			validServiceName.forEach(serviceName =>
				requestImportServiceStatus({ pid, serviceName })
			);
		}
		lightboxOpen();
	};

	componentDidUpdate = () => {
		const { sourceList, process, onFinishImport, firstUse } = this.props;

		// 如果 sourceList 沒資料，直接完成
		const isFetchAllServiceStatusDone = validServiceName.every(serviceName =>
			checkProcessIsDone(process, serviceName, 'importServiceStatus')
		);
		if (firstUse && !sourceList.size && isFetchAllServiceStatusDone) {
			onFinishImport();
		}
	};

	_handleChange = serviceName => {
		const {
			pid,
			requestImportServiceDetail,
			importSource,
			sourceList,
			onFinishImport,
		} = this.props;

		// 新增履歷
		if (serviceName === 'newResume') {
			this.setState({
				showChooseImportBlocks: false,
				selectedService: serviceName,
			});
			onFinishImport();
			return;
		}

		// 如果該 service 選項沒資料，取消
		if (
			sourceList.includes(serviceName) &&
			importSource.getIn([serviceName, 'hasData'])
		) {
			if (!importSource.getIn([serviceName, 'rawData'])) {
				requestImportServiceDetail({ pid, serviceName });
			}
			this.setState({
				showChooseImportBlocks: true,
				selectedService: serviceName,
			});
		}
	};

	_handleCancel = () => {
		const { firstUse, lightboxClose, history, onCancel } = this.props;
		lightboxClose();
		this.setState({ showChooseImportBlocks: false }, () => {
			// 只有第一次使用時，關閉匯入視窗會導回入口頁
			if (firstUse && this.state.selectedService !== 'newResume')
				return history.push('/');

			// 執行外層取消時要做的事
			onCancel && onCancel();
		});
	};

	_checkboxBlock = (blockType, blockData) => {
		const { selectedBlocks, replaceAlertBlocks } = this.state;

		// 取消勾選
		if (selectedBlocks.includes(blockType)) {
			this.setState({
				selectedBlocks: selectedBlocks.filter(arr => arr !== blockType),
				replaceAlertBlocks: replaceAlertBlocks.filter(arr => arr !== blockType),
			});
			return;
		}

		// 新勾選，可能會顯示覆蓋提示
		this.setState({
			selectedBlocks: selectedBlocks.push(blockType),
			replaceAlertBlocks: blockData.get('exists')
				? replaceAlertBlocks.push(blockType)
				: replaceAlertBlocks,
		});
	};

	// 關閉 lightbox 導入口頁
	_handleImportCancel = () => {
		this.setState({
			selectedService: '',
			showChooseImportBlocks: false,
			selectedBlocks: fromJS([]),
			replaceAlertBlocks: fromJS([]),
		});
	};

	// 確認匯入
	_handleImportSubmit = () => {
		const { selectedService, selectedBlocks } = this.state;
		const { pid, importProcess, onFinishImport } = this.props;
		if (selectedBlocks.size > 0) {
			importProcess(
				{ pid, serviceName: selectedService, selectedBlocks },
				onFinishImport
			);
		}
	};

	_renderByStage = (stage = '') => {
		const { selectedService, selectedBlocks, replaceAlertBlocks } = this.state;
		const { importSource, firstUse, sourceList } = this.props;
		// console.log('[containers_import] current render stage: ', stage);
		switch (stage) {
			// 取得引入的外部服務狀態 loading
			case 'fetchingImportSourceStatus':
				return (
					<LightboxLoading>
						<h4 style={{ marginBottom: '30px' }}>
							取得匯入的外部服務資料中 ...
						</h4>
						<Loading />
					</LightboxLoading>
				);

			// 取得該服務匯入資料的 loading
			case 'fetchingImportSourceBlocks':
				return (
					<LightboxLoading>
						<h4 style={{ marginBottom: '30px' }}>取得欲匯入的區塊資料中 ...</h4>
						<Loading />
					</LightboxLoading>
				);

			// 選擇匯入的選項
			case 'chooseImportSource':
				return (
					<Fragment>
						{sourceList.size > 0 && (
							<div className="import-title">選擇匯入的資料</div>
						)}
						<div
							className={
								sourceList.size < 1
									? 'import-no-data-content'
									: firstUse
									? 'import-content'
									: 'import-content-login'
							}
						>
							{sourceList.size ? (
								sourceList.map((serviceName, index) => (
									<div
										key={`${index}-${serviceName}`}
										className="import-item"
										onClick={this._handleChange.bind(this, serviceName)}
									>
										{selectedService === serviceName && (
											<Icon type="check" style={check_icon} />
										)}
										<img
											src={
												(this.serviceMap[serviceName] &&
													this.serviceMap[serviceName].icon) ||
												iconNew
											}
											alt={
												(this.serviceMap[serviceName] &&
													this.serviceMap[serviceName].name) ||
												serviceName
											}
										/>
										<div className="serviceName">
											{(this.serviceMap[serviceName] &&
												this.serviceMap[serviceName].name) ||
												serviceName}
										</div>
									</div>
								))
							) : (
								<div>
									<p className="import-empty">
										你在 104 相關服務目前沒有履歷資料可匯入，直接在 104個人檔案
										創建一份檔案吧！
									</p>
									<div className="import-no-data">
										<GrayBorderButtonWhiteBackground
											onClick={this.props.lightboxClose}
										>
											我知道了
										</GrayBorderButtonWhiteBackground>
									</div>
								</div>
							)}
							{firstUse && sourceList.size && (
								<div
									className="import-item"
									onClick={this._handleChange.bind(this, 'newResume')}
								>
									{selectedService === 'newResume' && (
										<Icon type="check" style={check_icon} />
									)}
									<img src={iconNew} alt="新增履歷" />
									<div>新增履歷</div>
								</div>
							)}
						</div>
					</Fragment>
				);

			// 選擇匯入的區塊
			case 'chooseImportBlocks':
				const importBlocksData = importSource.getIn([
					selectedService,
					'rawData',
				]);
				const optionList =
					importBlocksData &&
					importBlocksData
						.filter((elm, blockType) => elm.get('hasData'))
						.map((elm, blockType) => {
							const name = elm.get('notes')
								? `${nameMap[blockType].name} (${elm.get('notes')})`
								: nameMap[blockType].name;
							return { blockType, elm, name };
						})
						.toArray();
				return (
					<Fragment>
						<div className="import-title">選擇要顯示的項目區塊</div>
						<dl className="import-select-block">
							{optionList
								? optionList.map(({ blockType, name, elm }) => {
										return (
											<dd
												key={`${
													this.state.selectedService
												}-blocks-${blockType}`}
											>
												<Checkbox
													onChange={this._checkboxBlock.bind(
														this,
														blockType,
														elm
													)}
													disabled={!elm.get('hasData')}
													checked={selectedBlocks.includes(blockType)}
												>
													{name}
												</Checkbox>
												{replaceAlertBlocks.includes(blockType) && (
													<p className="replact-alert">* 將會覆蓋現有資料</p>
												)}
											</dd>
										);
								  })
								: '目前沒資料'}
						</dl>
						<div className="lightbox-button-main">
							<GrayBorderButton
								style={{ marginRight: '30px' }}
								onClick={this._handleImportCancel}
							>
								返 回
							</GrayBorderButton>
							{selectedBlocks.size > 0 ? (
								<SubmitButton onClick={this._handleImportSubmit}>
									確 認
								</SubmitButton>
							) : (
								<DisabledSubmitButton>確 認</DisabledSubmitButton>
							)}
						</div>
					</Fragment>
				);

			// 匯入處理中
			case 'importing':
				return (
					<LightboxLoading>
						<h4 style={{ marginBottom: '30px' }}>匯入資料處理中 ...</h4>
						<Loading />
					</LightboxLoading>
				);

			default:
				console.warn('[containers_import] invalid stage:', stage);
				return (
					<LightboxLoading>
						<LightboxWrongCopy text="匯入處理錯誤，請再重試一次！" />
					</LightboxLoading>
				);
		}
	};

	render() {
		let content = null;
		const isFetchingAllServiceStatus = validServiceName.some(serviceName =>
			checkProcessIsLoading(
				this.props.process,
				serviceName,
				'importServiceStatus'
			)
		);
		if (isFetchingAllServiceStatus) {
			content = this._renderByStage('fetchingImportSourceStatus');
		} else if (
			checkProcessIsLoading(
				this.props.process,
				this.state.selectedService,
				'importServiceDetail'
			)
		) {
			content = this._renderByStage('fetchingImportSourceBlocks');
		} else if (checkProcessIsLoading(this.props.process, 'importProcess')) {
			content = this._renderByStage('importing');
		} else {
			content = this.state.showChooseImportBlocks
				? this._renderByStage('chooseImportBlocks')
				: this._renderByStage('chooseImportSource');
		}
		return (
			<Lightbox
				title="快速創建你的個人檔案"
				width={!this.state.showChooseImportBlocks ? '600px' : ''}
				afterClose={this._handleCancel}
				cssClassName="importLightbox"
			>
				<div className="import-main">{content}</div>
			</Lightbox>
		);
	}
}

const mapStateToProps = state => ({
	pid: state.getIn(['user', 'pid']),
	importSource: state.get('import'), // { plus: { hasData, rawData }, ... }
	sourceList:
		state
			.get('import')
			.filter(elm => elm.get('hasData'))
			.keySeq() || fromJS([]), // ['plus', 'my104'....]
	process: state.getIn(['process']),
});

export default withRouter(
	connect(
		mapStateToProps,
		{
			lightboxOpen,
			lightboxClose,
			logout,
			requestImportServiceStatus,
			requestImportServiceDetail,
			importProcess,
		}
	)(Import)
);
