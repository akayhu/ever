import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CSSModules from 'react-css-modules';
import css from './index.css';
import clientConfig from 'src/configs/client';

const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement && window.open);

class BeAGiverResumeclinic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			iframeHeight: '1000',
			resumeclinicPageNow: 'area/resumeclinic/main'
		};
	}
	componentWillMount() {
		// 拿掉過時的履歷診療室，直接打網址進來轉址到新網址
		location.href = 'https://www.104.com.tw/freshman/taker.htm';

		const e104Router = 'area/resumeclinic';
		if (this.props.location.query && this.props.location.query.type) {
			switch (this.props.location.query.type) {
				case 'main': // 履歷診療室
					this.setState({ resumeclinicPageNow: `${e104Router}/main` });
					break;
				case 'stream': // 履歷直播間
					this.setState({ resumeclinicPageNow: `${e104Router}/stream` });
					break;
				case 'info': // 活動說明
					this.setState({ resumeclinicPageNow: `${e104Router}/main` });
					if (canUseDOM) { // 活動說明文章，固定aid
						window.open('/activity/6b857787-b8b0-4ab3-8085-4d9c730d1050');
					}
					break;
				case 'project': // project
					this.setState({ resumeclinicPageNow: `${e104Router}/project` });
					break;
				default: // 預設首頁-履歷診療室
					this.setState({ resumeclinicPageNow: `${e104Router}/main` });
			}
		}
	}
	componentDidMount() {
		ReactDOM.findDOMNode(this.refs.resumeclinicIframe).addEventListener('load', this.iframePostMessage.bind(this));
		window.onmessage = this.onMessage.bind(this);
	}
	onMessage() {
		const resumeclinicRouter = '/104beagiver/resumeclinic';
		if (arguments && arguments[0]) {
			if (arguments[0].data.height) { // iframe高
				this.setState({
					iframeHeight: arguments[0].data.height + 20
				});
			} else if (arguments[0].data.url) { // iframe傳url
				window.open(arguments[0].data.url);
			} else if (arguments[0].data.menu) { // iframe傳目前頁籤
				switch (arguments[0].data.menu) {
					case 'main':
						window.history.replaceState({}, '', resumeclinicRouter);
						break;
					case 'project':
					case 'stream':
						window.history.replaceState({}, '', `${resumeclinicRouter}?type=${arguments[0].data.menu}`);
						break;
					case 'info':
						window.open('/activity/6b857787-b8b0-4ab3-8085-4d9c730d1050'); // 活動說明文章，固定aid
						window.history.replaceState({}, '', `${resumeclinicRouter}?type=${arguments[0].data.menu}`);
						break;
					default:
						window.history.replaceState({}, '', resumeclinicRouter);
						break;
				}
			}
		}
	}
	iframePostMessage() {
		const winIframe = ReactDOM.findDOMNode(this.refs.resumeclinicIframe).contentWindow;
		const query = this.props.location.query;
		const UUIDReg = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/;
		if (query && query.id) {
			const uuid = query.id.match(UUIDReg);
			if (uuid === null) { // 若不是uuid格式則不傳送id給iframe
				delete query.id;
			}
		}
		winIframe.postMessage(query, '*');
	}
	render() {
		const { iframeHeight, resumeclinicPageNow } = this.state;
		return (
			<div styleName="resumeclinicMain">
				<iframe
					ref="resumeclinicIframe"
					height={ iframeHeight }
					src={ `${clientConfig.params.e104Url}/${resumeclinicPageNow}` }
					frameBorder="0"
				/>
			</div>
		);
	}
}

export default CSSModules(BeAGiverResumeclinic, css, { allowMultiple: true });
