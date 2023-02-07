import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Paint from './paint';
import Factory from './factory';
import Drawer from 'material-ui/Drawer';
import { menubarOpen, menubarClose } from 'actions/ui/menubar';
import { postPlusFlow } from 'actions/serviceInfo';
import { isMobile } from 'react-device-detect';
import NoviceGuide from 'components/noviceGuide';
import ActivationGuide from 'components/activationGuide';
import Scroll from 'containers/scroll';
import { Icon } from 'antd';
import './style.css';

const EditorMain = props => {
	const loginFromPreLogin =
		props.match.params.mode === 'loginFromPreLogin' ? true : false;
	const { commonMode } = props;
	const dispatch = useDispatch();
	const visible = useSelector(state =>
		state.getIn(['ui', 'menubar', 'visible'])
	);
	const noviceGuide = useSelector(state =>
		state.getIn(['ui', 'noviceGuide', 'noviceGuideStart'])
	);
	// 如果是 false 代表已經看過服務轉移通知
	const showEditorService = useSelector(state =>
		state.getIn(['serviceInfo', 'showEditorService'])
	);
	const handleToggle = () => {
		visible ? dispatch(menubarClose()) : dispatch(menubarOpen());
	};
	const renderEditorService = () => {
		if (commonMode) return;
		if (!showEditorService) return;
		return <ActivationGuide />;
	};

	// 一進編輯頁 menubar 打開
	useEffect(() => {
		dispatch(menubarOpen());
	}, []);

	if (!commonMode) window.history.pushState(null, null, '/editor');

	if (loginFromPreLogin && showEditorService) {
		const pid = useSelector(state => state.getIn(['user', 'pid']));
		const status = 4;
		useEffect(() => {
			dispatch(
				postPlusFlow({
					status,
					pid,
				})
			);
		}, []);
	}

	return (
		<div className="main-container">
			<Scroll />
			<Paint commonMode={commonMode} />
			{/* 項目 */}
			<Drawer
				width={isMobile ? 170 : 262}
				open={visible}
				className={
					isMobile && commonMode
						? 'main-container-information-mobile'
						: 'main-container-information'
				}
			>
				<div
					className="main-container-information-switch"
					onClick={handleToggle}
				>
					<Icon
						type={visible ? 'close' : 'right'}
						style={visible ? { margin: '17px 0 0 22px' } : {}}
						theme="outlined"
					/>
				</div>
				<Factory commonMode={commonMode} />
			</Drawer>
			{noviceGuide && <NoviceGuide />}
			{renderEditorService()}
		</div>
	);
};

export default withRouter(EditorMain);
