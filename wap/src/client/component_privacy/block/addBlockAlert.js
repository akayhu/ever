import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { LightBox } from 'c_wap_module';

// components
import Image from 'src/client/component_common/image';

// actions
import { block, loadDataByCategory } from 'src/client/actions/connection';

class AddBlockAlert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLightBox: false,
			loading: false
		};
	}
	handleAddBlock() {
		const { pid, targetPid, haveDoubleLightbox, block, loadDataByCategory, handleOnClose } = this.props;
		this.setState({loading: true});
		block({
			pid,
			targetPid,
			blockStatus: true
		}).then(() => {
			if (haveDoubleLightbox) {
				// 有第二層lightbox，告訴使用者已確定將xxx加入黑名單囉
				this.setState({
					showLightBox: true,
					loading: false
				});
				return;
			}
			// For BlockPrivacy 黑名單頁面用的
			handleOnClose();
			loadDataByCategory('blockListItem', {offset: 0});
			this.setState({
				loading: false
			});
		});
	}
	handleToPrivacyPage() {
		this.props.router.push({
			pathname: '/privacy',
			query: { category: 'block' },
			state: { autoOpenEditor: true }
		});
	}
	render() {
		const { loading } = this.state;
		const { targetPid, avatarWebUrl, userName, connect, handleOnClose } = this.props;
		const lightboxOption = {
			submit: {
				text: '確定',
				action: this.handleToPrivacyPage.bind(this)
			},
			closeIcon: false,
			title: '已加入黑名單'
		};
		return (
			<div styleName="block_lightbox">
				<div styleName="name_card">
					<Link to={ `/profile/${targetPid}` }>
						<Image
							type={ 'avatar' }
							src={ avatarWebUrl }
						/>
					</Link>
					<Link to={ `/profile/${targetPid}` }>
						<span>{ userName }</span>
					</Link>
				</div>
				<div styleName="title">
					設為黑名單後，{ userName }將無法再：
				</div>
				<ul>
					<li>查看你在首頁上發表的內容</li>
					<li>標註你</li>
					<li>邀請你參加的社團</li>
					<li>開始和你的對話</li>
					<li>加你為朋友</li>
				</ul>
				{
					connect === 3 &&
					<div styleName="desc">
						如果你們是朋友，加入黑名單將會解除朋友關係。<br />
						或許在這之前，你可以考慮先解除朋友關係
					</div>
				}
				<div styleName="footer">
					<button
						className={ `ui primary button ${loading ? 'loading' : ''}` }
						onClick={ this.handleAddBlock.bind(this) }
					>
						加入黑名單
					</button>
					<button
						className="ui normal button"
						onClick={ handleOnClose.bind(this) }
					>
						取消
					</button>
				</div>
				{
					this.state.showLightBox &&
					<div styleName="block_success">
						<LightBox
							option={ lightboxOption }
							onClose={ this.handleToPrivacyPage.bind(this) }
						>
							<p>已將[ { userName } ]加入名單，你們的關係已解除。</p>
							<p>若要移除，可至「隱私設定 {'>'} 黑名單」編輯。</p>
						</LightBox>
					</div>
				}
			</div>
		);
	}
}

AddBlockAlert.propTypes = {
	pid: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired,
	]),
	targetPid: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired,
	]),
	userName: PropTypes.string,
	avatarWebUrl: PropTypes.string,
	connect: PropTypes.number.isRequired,
	handleOnClose: PropTypes.func.isRequired,
	haveDoubleLightbox: PropTypes.bool.isRequired
};


export default compose(
	connect(null, {
		block,
		loadDataByCategory
	}),
	withRouter,
	[CSSModules, '_', css, { allowMultiple: true }]
)(AddBlockAlert);
