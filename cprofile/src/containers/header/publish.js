import React, { Fragment, useEffect } from 'react';
import { compose } from 'recompose';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { isBrowser } from 'react-device-detect';
import styled from 'styled-components';
import Lightbox from 'components/lightbox';
import LightboxError from 'components/lightboxWrongCopy';
import Privacy from './privacy';
import stateMachine from './statemachine/publish';
import schema from 'config/schema';
import honorSchema from 'config/honorSchema';
import { withBlockingAlert } from 'containers/blockingAlert';
import { hasAnyProcessing } from 'utils/process';
import { withConditionAlert } from 'containers/conditionAlert';
import { isAllRequiredFieldDone } from 'utils/validation';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { setProfilePrivacy } from 'actions/profile';
import { putPlusFlow, changeStatus } from 'actions/serviceInfo';
import { Tooltip } from 'antd';
import {
	Loading,
	SubmitButton,
	SubmitButtonSmallSquare as PublishButton,
} from 'share/styledComponents';
import {
	registerStateMachine,
	stateMachineTransition,
	removeStateMachine,
} from 'actions/ui/statemachine';
import './publish.scss';

const BorderButton = styled(PublishButton)`
	background-color: transparent;
	color: #f5b532;
	font-weight: normal;
`;

const Publish = props => {
	const {
		checkConditionAndBlocking,
		checkConditionAndShowAlert,
		mobileOpen,
		onCancel,
	} = props;
	const dispatch = useDispatch();
	const userName = useSelector(state =>
		state.getIn(['user', 'data', 'userName'])
	);
	const showUnPublish = useSelector(state =>
		['PUBLIC', 'LINK'].includes(
			state.getIn(['profile', 'privacy', 'type'], 'PRIVATE')
		)
	);
	const currentFrame = useSelector(state =>
		state.getIn(['ui', 'statemachine', 'publish', 'value'])
	);

	useEffect(() => {
		dispatch(registerStateMachine('publish', stateMachine));
		return () => {
			dispatch(removeStateMachine('publish'));
		};
	}, []);

	//發佈時將 status 從 2 改成 3

	const pid = useSelector(state => state.getIn(['user', 'pid']));
	const oldStatus = useSelector(state =>
		state.getIn(['serviceInfo', 'status'])
	);

	const onChangeServiceStatus = () => {
		if (oldStatus !== 2) return;
		const newStatus = 3;
		dispatch(putPlusFlow({ status: newStatus, pid }));
		dispatch(changeStatus(newStatus));
	};

	/**
	 * event handler
	 */
	const onStartPublish = () => {
		checkConditionAndBlocking(() => {
			checkConditionAndShowAlert(() => {
				dispatch(stateMachineTransition('publish', 'START_PUBLISH'));
				dispatch(lightboxOpen());
				onChangeServiceStatus();
			});
		});
	};

	const onUnPublishConfirm = () => {
		checkConditionAndBlocking(() => {
			dispatch(stateMachineTransition('publish', 'SHOW_UNPUBLISH_CONFIRM'));
			dispatch(lightboxOpen());
		});
	};

	const onStartUnPublish = () => {
		dispatch(setProfilePrivacy('PRIVATE'));
		dispatch(stateMachineTransition('publish', 'START_UNPUBLISH'));
		thisOnCancel();
	};

	const thisOnCancel = () => {
		dispatch(stateMachineTransition('publish', 'HIDE_LIGHTBOX'));
		dispatch(lightboxClose());
		if (mobileOpen) onCancel();
	};

	/**
	 * render
	 */
	const renderActions = () => (
		<Fragment>
			{showUnPublish && isBrowser && (
				<span className={`publish-action--${isBrowser ? 'browser' : 'mobile'}`}>
					<BorderButton
						onClick={onUnPublishConfirm}
						id="editor_closepublic_button"
					>
						停止公開
					</BorderButton>
				</span>
			)}
			<span className={`publish-action--${isBrowser ? 'browser' : 'mobile'}`}>
				<Tooltip placement="bottom" title="發佈後即可選擇公開或僅供連結分享">
					<PublishButton onClick={onStartPublish} id="editor_publish_button">
						{isBrowser ? '發佈檔案' : '發佈'}
					</PublishButton>
				</Tooltip>
			</span>
		</Fragment>
	);

	const renderFrame = (frame = currentFrame) => {
		const frameType = {
			publishing: renderLoading('正在發佈個人檔案...'),
			loadPrivacy: renderLoading('正在取得檔案設定...'),
			privacy: renderPrivacy(),
			unpublishConfirm: renderUnPublishConfirm(),
			error: renderError(),
			default: null,
		};
		return frameType[frame] || frameType['default'];
	};

	const renderLoading = (mainText = '正在處理中...') => (
		<Lightbox
			title="處理中，請稍候"
			width="580px"
			cssClassName="publish-lightbox"
			afterClose={thisOnCancel}
			onCancel={thisOnCancel}
		>
			<div className="publish-lightbox__loading">
				<h3>{mainText}</h3>
				<Loading />
			</div>
		</Lightbox>
	);

	const renderPrivacy = () => (
		<Lightbox
			title={`${userName ? `${userName}，` : '恭喜！'}您已成功發佈！`}
			width="580px"
			cssClassName="publish-lightbox"
			afterClose={thisOnCancel}
			onCancel={thisOnCancel}
		>
			<Privacy />
		</Lightbox>
	);

	const renderError = (
		text = `您可先至您的<a href="/profile/${pid}" target="_blank" title="個人頁" rel="noopener noreferrer">個人頁</a>查看發布狀況<br />如作品尚未顯示完全，表示資料仍在處理中，<br />請稍後片刻再重整或發布`
	) => (
		<Lightbox
			width="580px"
			cssClassName="publish-lightbox"
			afterClose={thisOnCancel}
			onCancel={thisOnCancel}
		>
			<div className="publish-lightbox__error">
				<LightboxError text={text} />
				<div className="publish-lightbox__action">
					<SubmitButton onClick={onStartPublish}>再次發佈</SubmitButton>
				</div>
			</div>
		</Lightbox>
	);

	const renderUnPublishConfirm = () => (
		<Lightbox
			title="停止公開檔案"
			width="580px"
			cssClassName="publish-lightbox"
			afterClose={thisOnCancel}
			onCancel={thisOnCancel}
		>
			<div className="publish-lightbox__confirm">
				<p>
					您的檔案將轉為關閉狀態，公開連結與加密連結皆將失效，確定要現在停止公開您的檔案嗎？
				</p>
				<div className="publish-lightbox__action--confirm">
					<button onClick={thisOnCancel}>取消</button>
					<button
						data-submit={true}
						id="editor_closepublic_doublecheck_button"
						onClick={onStartUnPublish}
					>
						停止公開
					</button>
				</div>
			</div>
		</Lightbox>
	);

	/**
	 * Utils
	 */
	return (
		<Fragment>
			{renderActions()}
			{renderFrame()}
		</Fragment>
	);
};

export default compose(
	withRouter,
	withBlockingAlert({
		condition: state => hasAnyProcessing(state.get('process')),
		message: '正在儲存資料中，請稍待片刻 ...',
	}),
	withConditionAlert({
		condition: state =>
			!isAllRequiredFieldDone(
				state.get('config'),
				state.get('data'),
				schema,
				honorSchema
			),
		message: '必填未填寫完整的資料將不會公開。',
	})
)(Publish);
