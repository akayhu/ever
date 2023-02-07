import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import nameCardUtil from './nameCardUtil';
// components
import LightboxWrapper from './lightboxWrapper';
import CardInfo from './cardInfo';
import CardBot from './cardBot';
import Image from 'src/client/component_common/image';

class CardBody extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mutualFriendLightBox: false,
			mutualfriends: { dataList: [] },
		};
		this.handleMutualFriendOpen = this.handleMutualFriendOpen.bind(this);
		this.closeLightBox = this.closeLightBox.bind(this);
		this.handleBodyClick = this.handleBodyClick.bind(this);
	}
	handleMutualFriendOpen(e) {
		
		e.preventDefault();
		const { pid, targetPid } = this.props.idInfo;
		nameCardUtil.getMutualFriend(pid, targetPid, (res) => {
			this.setState({
				mutualfriends: res,
				mutualFriendLightBox: true
			});
		});
		e.stopPropagation();
	}
	closeLightBox(e) {
		this.setState({
			mutualFriendLightBox: false,
			subscribeLightBox: false
		});
		e.stopPropagation();
	}
	handleBodyClick(e) {
		e.stopPropagation();
	}
	loadMore(type) {
		const lightboxTarget = type === 'mutualfriends' ? 'mutualFriendLightBox' : 'subscribeLightBox';
		const { pid, targetPid } = this.props.idInfo;
		const source = this.state[type];

		nameCardUtil.getMutualFriend(pid, targetPid, ({dataList}) => {
			this.setState({
				[type]: {...this.state[type], dataList: source.dataList.concat(dataList)},
				[lightboxTarget]: true
			});
		}, source.dataList.length);
	}
	render() {
		const {coverWebUrl} = this.props;
		const { pid: myPid } = this.props.idInfo.pid;
		return (
			<div styleName="card_view_wrap" onClick={this.handleBodyClick}>
				<div styleName="cover_img_block">
					<span styleName="black" />
					<Image
						src={ coverWebUrl }
						type="cover"
						domain="profile"
					/>
				</div>
				<CardInfo { ...this.props } />
				<CardBot
					{ ...this.props }
					handleMutualFriendOpen={ this.handleMutualFriendOpen }
				/>
				{ this.state.mutualFriendLightBox && this.props.pid !== myPid &&
					<LightboxWrapper
						title="共同朋友"
						loadMore={ this.loadMore.bind(this, 'mutualfriends') }
						handleClose={ this.closeLightBox }
						dataList={ this.state.mutualfriends.dataList }
					/>
				}
			</div>
		);
	}
}

const CardBodyCss = CSSModules(CardBody, css, {allowMultiple: true});

export default CardBodyCss;
