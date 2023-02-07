"use strict";

import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import {changeLanguage} from '../../actions/language';
import css from './style.css';

class Footer extends Component {
	constructor( props, context ){
		super( props, context );
		const d = new Date();
		this.nowYear = d.getFullYear();
	}

	languageChange(language){
		this.props.changeLanguage(language);
	}

	render() {
		const t = this.props.t;
		const footerLicense = t('common:footerLicense');
		const showFooter = (pathname) => {
			const regExpArray = pathname.match(/[^\/]\w*/g);
			if (regExpArray === null) {
				// 首頁
				return false;
			} else if (regExpArray[0] === 'channel' && regExpArray[1] && !regExpArray[2]) {
				// 頻道主頁面
				return false;
			}	else if (regExpArray[0] === 'group' && regExpArray[1] && !regExpArray[2]) {
				// 社團主頁面
				return false;
			} else if (regExpArray[0] === '104beagiver'){
				// be a giver 頁
				return false;
			}
			return true;
		}
		const showGiverFooter = (pathname) => {
			const regExpArray = pathname.match(/[^\/]\w*/g);
			if (regExpArray && regExpArray[0] === '104beagiver') {
				return true;
			}
			return false;
		}
		return (
			<div>
				{
					showGiverFooter(this.props.location.pathname) &&
					<footer className={css.giver_footer}>
						<div className={css.giver_content}>
							Be A Giver 由 104 希望基金會發起<br />
							一零四資訊科技股份有限公司
						</div>
					</footer>
				}
   			{
					showFooter(this.props.location.pathname) &&
					<footer className={css.footer}>
						<a href="http://corp.104.com.tw" target="_blank">一零四資訊科技股份有限公司</a>
						版權所有 © { this.nowYear } 建議瀏覽器IE10.0以上
						{/*this.props.language==='en'?
							(<span className={css.on}>English</span>):
							(<a href="#" onClick={this.languageChange.bind(this, "en")}>English</a>)}
							{this.props.language==='zhTW'?
							(<span className={css.on}>中文</span>):
							(<a href="#" onClick={this.languageChange.bind(this, "zhTW")}>中文</a>)*/}
						</footer>
				}
		  </div>
		);
	}
}

function mapStateToProps(state, props){
	return {
		language: state.language
	};
}

const FooterCss = CSSModules( Footer, css, { allowMultiple : true } )
const FooterTranslate = translate( [] )( FooterCss );
export default connect(mapStateToProps, {changeLanguage})(FooterTranslate);
