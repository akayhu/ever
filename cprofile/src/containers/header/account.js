import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { Menu, Dropdown, Icon } from 'antd';
import generalConfig from 'config/general';
import { logout } from 'actions/user';
import { Link } from 'react-router-dom';
import Import from '../import';
import Publish from './publish';
import { withBlockingAlert } from 'containers/blockingAlert';
import { hasAnyProcessing } from 'utils/process';
import { BrowserView, MobileView } from 'react-device-detect';
import { noviceGuideStart } from 'actions/ui/noviceGuide';
import { lightboxOpen } from 'actions/ui/lightbox';
import { stateMachineTransition } from 'actions/ui/statemachine';
import { UserName } from './styledComponents';

const AccountMenu = props => {
	const {
		history,
		checkConditionAndBlocking,
		fetchAllDataProcessStart,
	} = props;
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [features, setFeatures] = useState('');
	const pid = useSelector(state => state.getIn(['user', 'pid']));
	const isLogin = useSelector(state => state.getIn(['user', 'login']));
	const name = useSelector(state => state.getIn(['user', 'data', 'userName']));
	const initial = useSelector(state => state.getIn(['user', 'initial']));
	const showUnPublish = useSelector(state =>
		['PUBLIC', 'LINK'].includes(
			state.getIn(['profile', 'privacy', 'type'], 'PRIVATE')
		)
	);

	const handleLogout = () => {
		dispatch(logout());
	};

	const handleUnPublishConfirm = () => {
		checkConditionAndBlocking(() => {
			dispatch(stateMachineTransition('publish', 'SHOW_UNPUBLISH_CONFIRM'));
			dispatch(lightboxOpen());
		});
	};

	const _handleCancel = () => {
		setOpen(false);
		setFeatures('');
	};

	const _handleFinishImport = () => {
		fetchAllDataProcessStart(pid);
	};

	const renderBrowserMenu = () => (
		<Menu>
			{initial && (
				<Menu.Item key="1">
					<Link
						to={`/profile/${pid}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						觀看我的頁面
					</Link>
				</Menu.Item>
			)}
			{/* {initial && (
				<Menu.Item key="2" onClick={() => history.push('/collection')}>
					<span>我的收藏</span>
				</Menu.Item>
			)} */}
			{/* {window.location.pathname === '/editor' && (
				<Menu.Item key="3" onClick={() => dispatch(noviceGuideStart())}>
					<span>教學引導</span>
				</Menu.Item>
			)} */}
			{/* {initial && <Menu.Divider />} */}
			{/* <Menu.Item key="4">
				<a
					href={`https:${generalConfig.accountsUrl}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					會員中心
				</a>
			</Menu.Item> */}
			{/* <Menu.Item key="5">
				<a
					href={`https:${generalConfig.staticUrl}/bigc/c_wap/html/statute/`}
					target="_blank"
					rel="noopener noreferrer"
				>
					服務條款
				</a>
			</Menu.Item> */}
			{/* <Menu.Item key="6">
				<a
					href={`https:${
						generalConfig.e104Url
					}/question_admin/reaction.cfm?faq_from=plus`}
					target="_blank"
					rel="noopener noreferrer"
				>
					意見反映
				</a>
			</Menu.Item> */}
			{/* <Menu.Item key="7" onClick={handleLogout}>
				<span>登出</span>
			</Menu.Item> */}
		</Menu>
	);

	const renderMobileMenu = () => (
		<Menu>
			{/* {window.location.pathname !== '/editor' && (
				<Menu.Item key="1" onClick={() => history.push('/editor')}>
					<span>{initial ? '編輯我的檔案' : '創建我的檔案'}</span>
				</Menu.Item>
			)} */}
			{initial && (
				<Menu.Item key="2" onClick={() => history.push('/search')}>
					<span>瞧瞧別人</span>
				</Menu.Item>
			)}
			{/* {initial && (
				<Menu.Item key="3" onClick={() => history.push('/collection')}>
					<span>我的收藏</span>
				</Menu.Item>
			)} */}
			{/* {initial && <Menu.Divider />} */}
			{initial && (
				<Menu.Item key="4">
					<Link to={`/profile/${pid}`} target="_blank">
						觀看我的頁面
					</Link>
				</Menu.Item>
			)}
			{/* {showUnPublish && (
				<Menu.Item key="5" onClick={handleUnPublishConfirm}>
					<span>停止公開頁面</span>
				</Menu.Item>
			)} */}
			{/* {window.location.pathname === '/editor' && (
				<Menu.Item key="6" onClick={() => dispatch(noviceGuideStart())}>
					<span>教學引導</span>
				</Menu.Item>
			)} */}
			{/* <Menu.Divider /> */}
			{/* <Menu.Item key="7">
				<a
					href={`https:${generalConfig.accountsUrl}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					會員中心
				</a>
			</Menu.Item> */}
			{/* <Menu.Item key="8">
				<a
					href={`https:${generalConfig.staticUrl}/bigc/c_wap/html/statute/`}
					target="_blank"
					rel="noopener noreferrer"
				>
					服務條款
				</a>
			</Menu.Item> */}
			{/* <Menu.Item key="9">
				<a
					href={`https:${
						generalConfig.e104Url
					}/jobs/search/showLogin?return_url=https%3A%2F%2F${
						generalConfig.e104Domain
					}%2Fquestion_admin%2Freaction.cfm%3Ffaq_from%3Dplus`}
					target="_blank"
					rel="noopener noreferrer"
				>
					意見反映
				</a>
			</Menu.Item> */}
			{/* <Menu.Item key="10" onClick={handleLogout}>
				<span>登出</span>
			</Menu.Item> */}
		</Menu>
	);

	if (isLogin) {
		return (
			<UserName>
				{/* 桌機版 */}
				<BrowserView>
					<Dropdown overlay={renderBrowserMenu()} placement="bottomRight">
						<span>
							{name || ''} <Icon type="down" />
						</span>
					</Dropdown>
				</BrowserView>

				{/* 平板＆手機板 */}
				<MobileView>
					<Dropdown
						overlay={renderMobileMenu()}
						placement="bottomRight"
						trigger={['click']}
					>
						<span>
							{name || ''} <Icon type="down" />
						</span>
					</Dropdown>
				</MobileView>

				{// mobile的匯入檔案
				open && features === 'import' && (
					<Import
						onCancel={_handleCancel}
						onFinishImport={_handleFinishImport}
						firstUse={false}
					/>
				)}
				{// 發佈
				open && features === 'publish' && (
					<Publish onCancel={_handleCancel} mobileOpen={open} />
				)}
			</UserName>
		);
	}

	return <a href={`${generalConfig.endpoints.login}`}>登入</a>;
};

export default compose(
	withRouter,
	withBlockingAlert({
		condition: state => hasAnyProcessing(state.get('process')),
		message: '正在儲存資料中，請稍待片刻 ...',
	})
)(AccountMenu);
