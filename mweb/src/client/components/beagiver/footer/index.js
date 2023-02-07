import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import clientConfig from 'src/configs/client';

import MBeAGiverFooter from './footer';

class MBeAGiverFooterMain extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showResults: false
		};
		this.togglMsg = this.togglMsg.bind(this);
	}
	togglMsg() {
		return this.setState({showResults: !this.state.showResults});
	}
	render() {
		return (
			<div styleName="footer_main">
				<div styleName="footer_iconArea">
					<a target="_blank" href="http://plus.104.com.tw/channel/60207">
						<i data-gtm-giver="Giver 頻道" styleName="icon_104" />
					</a>
					<a target="_blank" href="https://www.facebook.com/wegiver/">
						<i data-gtm-giver="Giver FB" styleName="icon_facebook" />
					</a>
					<a target="_blank" href="https://www.youtube.com/channel/UCUmO-V9bW7MGJhlnDWsYvkg">
						<i data-gtm-giver="Giver Youtube" styleName="icon_youtube" />
					</a>
					<a onClick={ this.togglMsg } href="javascript: void(0);">
						<i data-gtm-giver="Giver 聯絡" styleName="icon_email" />
					</a>
					{
						this.state.showResults
						? <div styleName="email_msg">
							與我們聯絡：<br />
							信箱：<a href="mailto:alliance@104.com.tw">alliance@104.com.tw</a><br />
							專線：02-29126104 分機8656,6863<br />
							工作時間：週一至週五 09:00~18:00
						</div>
						: null
					}
				</div>
				<div styleName="webAppDownload">
					<a 
						styleName="ios"
						data-gtm-giver="APP-iOS"
						href="https://itunes.apple.com/tw/app/giver/id1136970263?l=zh&amp;mt=8" 
						target="_blank"
					></a>
					<a 
						styleName="android"
						data-gtm-giver="APP-Android" 
						href="https://play.google.com/store/apps/details?id=com.m104giver" 
						target="_blank"
					></a>
				</div>
				<div styleName="footer_text">有你站出來，他會不一樣，邀你一起 Be A Giver</div>
				<MBeAGiverFooter />
			</div>
		);
	}
}

export default CSSModules(MBeAGiverFooterMain, css, {allowMultiple: true});
