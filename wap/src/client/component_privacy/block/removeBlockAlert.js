import { Link } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Image from 'src/client/component_common/image';

const RemoveBLockAlert = ({dataList, loading, handleOnSubmit, handleOnClose}) => {
	if (!dataList) return null;
	return (
		<div styleName="block_lightbox">
			<div styleName="name_card">
				<Link to={ `/profile/${dataList.pid}` }>
					<Image
						src={ dataList.avatarWebUrl }
						type="avatar"
					/>
				</Link>
				<Link to={ `/profile/${dataList.pid}` }>
					<span>{ dataList.name }</span>
				</Link>
			</div>
			<div styleName="title">移除黑名單後：</div>
			<ul>
				<li>取決於你的隱私設定，{ dataList.name }可以從首頁看到你的動態。</li>
				<li>{ dataList.name }也可以看到你的個人檔案頁公開的資訊，並透過訊息中心和你連絡。</li>
			</ul>
			<div styleName="footer">
				<button
					className={ `ui primary button ${loading ? 'loading' : ''}` }
					onClick={ handleOnSubmit.bind(this, false, dataList.pid) }
				>
					移除黑名單
				</button>
				<button
					className="ui normal button"
					onClick={ handleOnClose.bind(this) }
				>
					取消
				</button>
			</div>
		</div>
	);
};

RemoveBLockAlert.propTypes = {
	dataList: PropTypes.object,
	loading: PropTypes.bool.isRequired,
	handleOnSubmit: PropTypes.func.isRequired,
	handleOnClose: PropTypes.func.isRequired
};

export default CSSModules(RemoveBLockAlert, css);
