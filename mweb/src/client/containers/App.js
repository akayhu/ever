import React from 'react';
import CSSModules from 'react-css-modules';
import Header from '../components/header';
import Alert from '../components/alert';
import LeftSideMenu from '../components/leftSideMenu';
import $ from 'jquery';
import css from './app.css';
import compose from 'src/util/compose';
import { connect } from 'react-redux';
import { actions as CPlatformActions } from 'c_platform';
import { initBubbleCount } from 'src/client/actions/bubble';
import clientConfig from 'src/configs/client';

const pusherConnectAction = CPlatformActions.pusher.PusherConnectAction;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showMenu: false,
			menuClass: 'wrap',
		};

		this.scrollTop = 0;
		this.toggleMenu = this.toggleMenu.bind(this);
	}
	componentDidMount() {
		$("."+css.mask).on('click', () => {
			this.toggleMenu();
		});
		if (this.props.isLogin) {
			// 登入初始化 pusher 連線，並取得未讀通知數量
			this.props.pusherConnectAction({
				key: clientConfig.params.pusher.key,
				options: {
					cluster: clientConfig.params.pusher.cluster,
					authEndpoint: '/ajax/pusher/auth',
					encrypted: true,
				},
			});
			this.props.initBubbleCount();
		}
	}
	getParamMap() {
		if (Object.keys(this.paramMap).length === 0 && typeof this.props.params !== 'undefined' && typeof this.props.location !== 'undefined') {
			this.paramMap = Object.assign({}, this.props.params, this.props.location.query);
		}

		return this.paramMap;
	}
	toggleMenu() {
		if(this.state.showMenu === false){
			this.setState({
				showMenu: !this.state.showMenu,
				menuClass: 'show_menu wrap'
			},() => {
				this.scrollTop = $("body").scrollTop();
				$("body").css("position","fixed");
				$("body main").css("margin-top",-(this.scrollTop-10)+"px");
				
				if($("body main nav").length > 0){
					$("body main nav").css("top",(this.scrollTop-10+77)+"px");
				}
			});
		}else{
			this.setState({
				showMenu: !this.state.showMenu,
				menuClass: 'hide_menu show_menu wrap'
			}, () => {
				setTimeout(() => {
					$("."+css.wrap).attr("class",css.wrap);
					$("body, body main, body main nav").removeAttr("style");
					$("body").scrollTop(this.scrollTop);
					this.scrollTop = 0;
				},400);
			});
		}
	}
	render() {
		const {showMenu, menuClass} = this.state;
		const {children} = this.props;

		return (
			<div styleName={menuClass}>
				<Header showMenu={!showMenu} toggleMenu={this.toggleMenu} />
				<Alert />
				<LeftSideMenu showMenu={!showMenu} toggleMenu={this.toggleMenu} />
				{ children }
				<button id="mask_close" styleName="mask" />
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isLogin: state.user.isLogin,
});

export default compose(
	connect(mapStateToProps, { initBubbleCount, pusherConnectAction }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(App);
