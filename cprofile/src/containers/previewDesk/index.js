import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
import { compose } from 'recompose';
import { useSelector, useDispatch } from 'react-redux';
import { Map } from 'immutable';
import { Icon, Radio } from 'antd';
import { withRouter } from 'react-router-dom';
import {
	WebAppBody,
	PaperAppContainer,
	WebAppContainer,
	BusinessCardAppContainer,
	BusinessCardAppBody,
	FullLoading,
	Loading,
} from 'share/styledComponents';
import {
	registerStateMachine,
	stateMachineTransition,
	removeStateMachine,
} from 'actions/ui/statemachine';
import { printStart } from 'actions/ui/print';
import BusinessCardStraight from 'containers/businessCardStraight';
import BusinessCardHorizontal from 'containers/businessCardHorizontal';
import TalentRatingDescription from 'components/talentRatingDescription';
import AlertBanner from 'components/alertBanner';
import Header from 'containers/header';
import nameMap from 'config/nameMap';
import generalConfig from 'config/general';
import Template from 'templates';
import stateMachine from './statemachine';
import './style.css';
import './devices.min.css';
import { previewOpen } from 'actions/ui/menubar';
import githubLogo from 'components/defaultSmallImage/PbyGithub.png';
import behanceLogo from 'components/defaultSmallImage/PbyBehance-horizontal.png';
import { BrowserView } from 'react-device-detect';
import { stripIncompleteData } from 'utils/selector';
import { nowYear } from 'utils/time';

// import schema from 'config/schema';
// import honorSchema from 'config/honorSchema';
// import { isAllRequiredFieldDone } from 'utils/validation';

const RadioGroup = Radio.Group;

// 顯示各區塊
const renderBlock = (key, configEntity, dataEntity) => {
	const blockConfig = configEntity.get(key);
	if (!blockConfig) return null;

	const blockType = blockConfig.get('blockType');
	if (!blockType) return null;

	// 過濾未儲存的資料
	let data = stripIncompleteData(
		blockType,
		dataEntity.get(key, Map()),
		blockConfig.toJS(),
		true
	);
	if (!data) return null;

	// 要傳給 template 的 props
	const config = {
		...blockConfig.toJS(),
		mask: blockConfig.get('mask') || Map(),
	};

	if (blockType === 'basic') {
		return <Template data={data.toJS()} config={config} />;
	}

	return (
		<div key={key} style={{ marginBottom: '25px' }}>
			<div className={`block-wrapper ${blockType}-${config.templateType}`}>
				{blockType !== 'custom' && (
					<div className="block-title">
						<span className="block-title-dash" />
						<h3>{nameMap[blockType].name}</h3>
						{blockType === 'talent' && <TalentRatingDescription />}
						{blockType === 'github' && (
							<BrowserView>
								<img src={githubLogo} className="github-banner" alt="github" />
							</BrowserView>
						)}
						{blockType === 'behance' && (
							<BrowserView>
								<img
									src={behanceLogo}
									className="behance-banner"
									alt="Behance"
								/>
							</BrowserView>
						)}
					</div>
				)}
				<Template data={data.toJS()} config={config} />
			</div>
		</div>
	);
};

// 預覽初始化
const renderLoading = () => {
	return (
		<WebAppBody>
			<Header
				optionLeftList={['comeBackEdit', 'spacer', 'preview']}
				optionRightList={['publish', 'login']}
			/>
			<FullLoading>
				<h3>預覽初始化中 ...</h3>
				<Loading />
			</FullLoading>
		</WebAppBody>
	);
};

// 桌機預覽
const renderPreviewWeb = ({
	requiredText,
	theme,
	basicConfigToJS,
	showList,
	refPrint,
	configEntity,
	dataEntity,
	// showRequiredFieldAlert
}) => {
	if (!basicConfigToJS || !showList) return null;
	return (
		<WebAppBody>
			<Header
				optionLeftList={['comeBackEdit', 'spacer', 'preview']}
				optionRightList={['publish', 'login']}
			/>
			{/* {showRequiredFieldAlert && (
				<AlertBanner
					className="preview-web-alert-banner"
					message={requiredText}
				/>
			)} */}
			<AlertBanner
				className="preview-web-alert-banner"
				message={requiredText}
			/>
			<WebAppContainer>
				<div
					className={`preview-desk-paint-web-wrapper ${theme}`}
					style={{ width: '100%', left: '0px' }}
					ref={refPrint}
				>
					<div
						className={`user-data user-${basicConfigToJS.templateType}`}
						id="previewDeskBasic"
					>
						{renderBlock(basicConfigToJS.uniKey, configEntity, dataEntity)}
					</div>
					<div className="paint-container">
						{showList.map(key => renderBlock(key, configEntity, dataEntity))}
					</div>
				</div>
			</WebAppContainer>
		</WebAppBody>
	);
};

// 紙張預覽
const renderPreviewPaper = ({
	requiredText,
	theme,
	basicConfigToJS,
	showList,
	userToJS,
	refPrint,
	configEntity,
	dataEntity,
	// showRequiredFieldAlert,
}) => {
	return (
		<WebAppBody>
			<Header
				optionLeftList={['comeBackEdit', 'spacer', 'preview']}
				optionRightList={['publish', 'login']}
			/>
			{/* {showRequiredFieldAlert && (
				<AlertBanner message={requiredText} />
			)} */}
			<AlertBanner message={requiredText} />
			<PaperAppContainer>
				<div style={{ padding: '80px 0' }}>
					<div
						id="preview-desk-paint-paper-wrapper"
						className={`preview-desk-paint-paper-wrapper ${theme}`}
						ref={refPrint}
					>
						<div
							className={`user-data user-${basicConfigToJS.templateType}`}
							id="previewDeskBasic"
						>
							{renderBlock(basicConfigToJS.uniKey, configEntity, dataEntity)}
						</div>
						<div className="paint-container">
							{showList.map(key => renderBlock(key, configEntity, dataEntity))}
						</div>
						<div className="QRCodeFooter">
							<div className="QRCode">
								<QRCode
									value={`https:${generalConfig.siteUrl}/profile/${
										userToJS.pid
									}`}
								/>
								<span>透過掃描 QR Code 更完整的認識我</span>
							</div>
							<div className="userName">
								<div>{userToJS.data.userName}</div>
								<div>{nowYear()} © plus.104.com.tw</div>
							</div>
						</div>
					</div>
				</div>
			</PaperAppContainer>
		</WebAppBody>
	);
};

// 平板預覽
const renderPreviewTablet = ({
	requiredText,
	theme,
	userToJS,
	// showRequiredFieldAlert,
}) => {
	return (
		<WebAppBody>
			<Header
				optionLeftList={['comeBackEdit', 'spacer', 'preview']}
				optionRightList={['publish', 'login']}
			/>
			{/* {showRequiredFieldAlert && (
				<AlertBanner message={requiredText} />
			)} */}
			<AlertBanner message={requiredText} />
			<PaperAppContainer>
				<div
					className={`device device-ipad-pro device-gold preview-desk-paint-tablet-wrapper ${theme}`}
					style={{ margin: '50px auto' }}
				>
					<div className="device-frame">
						<iframe
							title="平板預覽"
							src={`${generalConfig.siteUrl}/profile/${userToJS.pid}/preview`}
							style={{
								width: '760px',
								height: '780px',
								border: '1px solid #d2d2d2',
							}}
						/>
					</div>
					<div className="device-stripe" />
					<div className="device-header" />
					<div className="device-sensors" />
					<div className="device-btns" />
					<div className="device-power" />
				</div>
			</PaperAppContainer>
		</WebAppBody>
	);
};

// 手機預覽
const renderPreviewMobile = ({
	requiredText,
	theme,
	userToJS,
	// showRequiredFieldAlert,
}) => {
	return (
		<WebAppBody>
			<Header
				optionLeftList={['comeBackEdit', 'spacer', 'preview']}
				optionRightList={['publish', 'login']}
			/>
			{/* {showRequiredFieldAlert && (
				<AlertBanner message={requiredText} />
			)} */}
			<AlertBanner message={requiredText} />
			<BusinessCardAppContainer>
				<div
					className={`device device-iphone-8 device-gold preview-desk-paint-mobile-wrapper ${theme}`}
					style={{ margin: '50px auto' }}
				>
					<div className="device-frame">
						<iframe
							title="手機預覽"
							src={`${generalConfig.siteUrl}/profile/${userToJS.pid}/preview`}
							style={{
								width: '375px',
								height: '666px',
								border: '1px solid #d2d2d2',
							}}
						/>
					</div>
					<div className="device-stripe" />
					<div className="device-header" />
					<div className="device-sensors" />
					<div className="device-btns" />
					<div className="device-power" />
				</div>
			</BusinessCardAppContainer>
		</WebAppBody>
	);
};

// 名片預覽
const renderPreviewBussinessCard = ({
	requiredText,
	theme,
	businessCard,
	basicData,
	basicDataToJS,
	userToJS,
	_radioChange,
	refPrint,
	// showRequiredFieldAlert,
}) => {
	return (
		<BusinessCardAppBody>
			<Header
				optionLeftList={['comeBackEdit', 'spacer', 'preview']}
				optionRightList={['publish', 'login']}
			/>
			{/* {showRequiredFieldAlert && (
				<AlertBanner message={requiredText} />
			)} */}
			<AlertBanner message={requiredText} />
			<BusinessCardAppContainer>
				<div className="businessCard-radio-content">
					<RadioGroup onChange={_radioChange} value={businessCard}>
						<Radio value={1}>直式</Radio>
						<Radio value={2}>橫式</Radio>
					</RadioGroup>
				</div>
				<div
					className={`preview-desk-paint-businessCard-wrapper ${theme}`}
					style={{
						width: `${businessCard === 1 ? '300px' : '439px'}`,
						margin: '50px auto',
						background: '#fff',
						boxShadow: '0px 0px 9px #999',
					}}
					ref={refPrint}
				>
					{businessCard === 1 && basicData && (
						<BusinessCardStraight data={basicData} pid={userToJS.pid} />
					)}
					{businessCard === 2 && basicData && (
						<BusinessCardHorizontal data={basicData} pid={userToJS.pid} />
					)}
				</div>
				{basicDataToJS &&
					(!basicDataToJS.title ||
						!basicDataToJS.organization ||
						!basicDataToJS.location) && (
						<p className="businessCard-unfilled">
							你還尚未填寫
							{!basicDataToJS.title ? '「職稱」' : ''}
							{!basicDataToJS.organization ? '「公司名稱」' : ''}
							{!basicDataToJS.location ? '「所在地區」' : ''}
							<br />
							返回編輯器至基本資料區填寫可以讓你的名片資訊更完整！
						</p>
					)}
			</BusinessCardAppContainer>
		</BusinessCardAppBody>
	);
};

// 預覽初始化失敗
const renderError = dispatch => {
	return (
		<WebAppBody>
			<Header
				optionLeftList={['comeBackEdit', 'spacer', 'preview']}
				optionRightList={['publish', 'login']}
			/>
			<FullLoading>
				<h3>預覽初始化失敗，請再試一次</h3>
				<Icon
					type="reload"
					theme="outlined"
					style={{ fontSize: 28 }}
					onClick={() =>
						dispatch(stateMachineTransition('preview', 'INIT_PREVIEW'))
					}
				/>
			</FullLoading>
		</WebAppBody>
	);
};

const PreviewDesk = props => {
	const basicConfig = useSelector(state =>
		state.get('config').find(data => data.get('blockType') === 'basic')
	);
	const storeData = {
		user: useSelector(state => state.get('user')),
		initial: useSelector(state => state.getIn(['user', 'initial'])),
		list: useSelector(state => state.get('blocksList')),
		dataEntity: useSelector(state => state.get('data')),
		configEntity: useSelector(state => state.get('config')),
		theme: useSelector(state => state.getIn(['ui', 'factory', 'theme'])),
		print: useSelector(state => state.getIn(['ui', 'print', 'printStart'])),
		basicData: useSelector(state =>
			state.getIn([
				'data',
				state.get('config').find(data => data.get('blockType') === 'basic') &&
					state
						.get('config')
						.find(data => data.get('blockType') === 'basic')
						.get('uniKey'),
			])
		),
		showList: useSelector(state =>
			state
				.get('blocksList')
				.filter(
					uniKey => state.getIn(['config', uniKey, 'blockType']) !== 'basic'
				)
		),
		currentState: useSelector(state =>
			state.getIn(['ui', 'statemachine', 'preview', 'value'])
		),
		statemachine: useSelector(state =>
			state.getIn(['ui', 'statemachine', 'preview', 'machine'])
		),
		// showRequiredFieldAlert: useSelector(state => !isAllRequiredFieldDone(
		// 	state.get('config'),
		// 	state.get('data'),
		// 	schema,
		// 	honorSchema
		// )),
	};
	const {
		theme,
		user,
		basicData,
		showList,
		currentState,
		configEntity,
		dataEntity,
	} = storeData;
	const { history, match } = props;
	const dispatch = useDispatch();
	const [businessCard, setBusinessCard] = useState(1); // 1 = 直式； 2 = 橫式
	const refPrint = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			await dispatch(
				registerStateMachine('preview', stateMachine, {
					device: match.params.previewName,
				})
			);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const { status, initial } = user.toJS();
		// 帳號未啟用，自動轉導到404
		if (!initial && (status === 'done' || status === 'error')) {
			return history.push('/error/404');
		}
		dispatch(previewOpen());
		return () => dispatch(removeStateMachine('preview'));
	}, []);

	useEffect(
		() => {
			dispatch(printStart(refPrint.current));
		},
		[refPrint.current]
	);

	useEffect(
		() => {
			dispatch(
				stateMachineTransition('preview', 'SHOW_PREVIEW', {
					device: match.params.previewName,
				})
			);
		},
		[match.params.previewName]
	);

	const userToJS = user.toJS();
	const basicDataToJS = basicData && basicData.toJS();
	const basicConfigToJS = basicConfig && basicConfig.toJS();
	const requiredText =
		'若有未填寫完整的資料，它們將不會顯示在頁面上。若區塊沒有任何一筆完整的資料，該區塊將不會顯示。';

	const _radioChange = e => {
		setBusinessCard(e.target.value);
	};

	if (!basicData) return renderLoading();

	const currentStateType = {
		// 桌機預覽
		previewWeb: renderPreviewWeb({
			requiredText,
			theme,
			basicConfigToJS,
			showList,
			refPrint,
			configEntity,
			dataEntity,
			// showRequiredFieldAlert,
		}),
		// 紙張預覽
		previewPaper: renderPreviewPaper({
			requiredText,
			theme,
			basicConfigToJS,
			showList,
			userToJS,
			refPrint,
			configEntity,
			dataEntity,
			// showRequiredFieldAlert,
		}),
		// 平板預覽
		previewTablet: renderPreviewTablet({
			requiredText,
			theme,
			userToJS,
			// showRequiredFieldAlert,
		}),
		// 手機預覽
		previewMobile: renderPreviewMobile({
			requiredText,
			theme,
			userToJS,
			// showRequiredFieldAlert,
		}),
		// 名片預覽
		previewBussinessCard: renderPreviewBussinessCard({
			requiredText,
			theme,
			businessCard,
			basicData,
			basicDataToJS,
			userToJS,
			_radioChange,
			refPrint,
			// showRequiredFieldAlert,
		}),
		// 預覽初始化失敗
		error: renderError(dispatch),
		// 預覽初始化
		loading: renderLoading(),
	};

	return currentStateType[currentState] || currentStateType['loading'];
};

export default compose(withRouter)(PreviewDesk);
