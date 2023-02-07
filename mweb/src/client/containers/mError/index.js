import React, { Component } from 'react';
// import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import ga from 'react-ga';
import compose from 'src/util/compose';
// components

class MError extends Component {
	constructor(props) {
		super(props);
		// this.state = {};
		this.errorCode = props.params.errorCode;
		this.errorStatus = props.params.errorStatus;
		this.errorMsg = null;
		this.checkMsg();
	}
	checkMsg() {
		if(this.errorCode/1 === 404){
			if(this.errorStatus === 'member'){
				this.errorMsg = "此帳號不存在或權限不足無法瀏覽";
			}else if(this.errorStatus === 'group'){
				this.errorMsg = "此社團不存在或權限不足無法瀏覽";
			}else if(this.errorStatus === 'channel'){
				this.errorMsg = "此頻道不存在或權限不足無法瀏覽";
			}else if(this.errorStatus === 'activity'){
				this.errorMsg = "此動態不存在或權限不足無法瀏覽";
			}else {
				this.errorMsg = "很抱歉，這個頁面不存在。";
			}
		}else if(this.errorCode/1 === 500){
			if(this.errorStatus === 'init'){
				this.errorMsg = "抱歉，帳號系統似乎出了點問題";
			}else{
				this.errorMsg = "系統忙碌中，請稍候再試";
			}
		}
	}
	componentDidMount() {
		ga.pageview(this.props.location.pathname);
	}
	componentWillUnmount() {
		this.errorCode = null;
		this.errorStatus = null;
		this.errorMsg = null;
	}
	render() {
		return (
			<main>
				<div styleName="errorPage">
					<p styleName="title">{this.errorMsg}</p>
					<div styleName="btn_section">
						<button
							className="ui button primary"
							onClick={ () => this.props.router.push('/m')}
						>
							回首頁
						</button>
						{/*<button
							className="ui button normal"
							onClick={ () => this.props.router.goBack()}
						>
							回上一頁
						</button>*/}
					</div>
				</div>
			</main>
		);
	}
}

// function selector(state, props) {
// 	console.log(state);
// 	return {
// 	};
// }

export default compose(
	// connect(selector, {}),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MError);
