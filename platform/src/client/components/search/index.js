import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, browserHistory } from 'react-router';
import update from 'react-addons-update';
import { TextField, DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import { registerLayer } from '../../actions/layerControl';
import $ from 'jquery';
import css from './style.css';
import clientConfig from '../../../configs/client';

const searchModeMap = {
	activity: "文章",
	person: "人物",
	group: "社團",
	channel: "頻道"
};

class Search extends Component {
	constructor(props, context){
		super(props, context);
		this.state = {
			isOpenFlyout: false,
			keyword: '',
			placeHolder: '搜尋文章、人、社團和頻道',
			defaultKeyword: '',
			mode: 'activity',
			ACData: [],
			errorMessage: ''
		};
		this.mounted = false;
		this.timer = null;
		if (props.params && props.params.keyword) {
			if (props.params.splat) {
				this.state.keyword = `${props.params.keyword}/${props.params.splat}`;
			} else {
				this.state.keyword = props.params.keyword;
			}
		}
		this.showOption = this.showOption.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this);
		this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this);
		this.ACItemSelected = this.ACItemSelected.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
	}
	componentDidMount(){
		this.mounted = true;
		registerLayer(() => {
			if (this.state.isOpenFlyout && this.mounted) {
				this.setState({
					isOpenFlyout: false
				});
			}
		});
		// for 預設關鍵字實驗
		if(!(this.props.params && (this.props.params.keyword || this.props.params.splat))) {
			this.getDefaultKeywordSetting((setting) => {
				this.setDefaultKeyword(setting);
			});
		}
	}
	componentWillUnmount() {
		this.mounted = false;
	}
	showOption() {
		this.setState({ isOpenFlyout: true });
	}
	selectOption(mode) {
		this.setState({
			mode,
			isOpenFlyout: false
		});
	}
	handleBlur() {
		this.setState(update(this.state, { $merge: { ACData: [] } }));
	}
	handleSearchKeyPress(name, value) {
		if (!value) {
			clearTimeout(this.timer);
			this.setState({
				keyword: '',
				ACData: []
			});
			return;
		}
		this.setState({ keyword: value });
		this.timer = setTimeout(() => {
			this.autoComplete(this.state.keyword, (res) => {
				if (this.state.mode === 'group' || this.state.mode === 'channel') {
					this.setState(
						update(this.state, {
							$set: { ACData: [] }
						})
					);
					return;
				}
				if (typeof res.response !== 'undefined') {
					var ACDATAtemp = res.response.map(function(item, index) {
						return { value: item };
					});
					this.setState(
						update(this.state, {
							$merge: { ACData: ACDATAtemp }
						})
					);
				}
			});
		}, 300);
	}
	handleSearchKeyDown(e) {
		if (e.keyCode === 13) {
			this.timer = setTimeout(() => {
				this.gotoSearch();
			}, 300);
		}
	}
	ACItemSelected(value, index) {
		this.setState({ keyword: value });
		this.timer = setTimeout(() => {
			this.gotoSearch();
		}, 300);
	}
	handleSearch() {
		this.timer = setTimeout(() => {
			this.gotoSearch();
		}, 300);
	}
	gotoSearch() {
		const { keyword, defaultKeyword, mode } = this.state;
		const searchKeyword = keyword || defaultKeyword || '';
		if (!searchKeyword) {
			return;
		}
		this.setState({
			ACData: []
		});
		switch(mode) {
			case 'activity':
				this.props.router.push('/search/activity/' + encodeURIComponent(searchKeyword));
				break;
			case 'person':
				this.props.router.push('/search/person/' + encodeURIComponent(searchKeyword));
				break;
			case 'group':
				this.props.router.push('/search/group/' + encodeURIComponent(searchKeyword));
				break;
			case 'channel':
				this.props.router.push('/search/channel/' + encodeURIComponent(searchKeyword));
				break;
		}
	}
	autoComplete(keyword, callback) {
		if(!keyword){
			return callback({});
		}
		let ajaxUrl = '/ajax/search/activityKeywordSuggest/' + keyword;
		$.ajax({
			method: 'get',
			url: ajaxUrl,
			success: callback
		});
	}
	// for 預設關鍵字實驗
	getDefaultKeywordSetting(callback) {
		// 預設關鍵字設定檔
		let ajaxUrl;
		if (clientConfig.env === 'dev' || clientConfig.env === 'lab') {
			ajaxUrl = `${clientConfig.params.staticPlatformUrl}/js/buzzwords.js`;  // dev, lab 讀取 public/js/buzzword.js
		} else {
			ajaxUrl = `${clientConfig.params.staticUrl}/plus/js/vendor/buzzwords.js`;  // staging, production 讀取 static 上 plus 的檔案
		}
		$.ajax({
			method: 'get',
			dataType: 'jsonp',
			async: true,
			crossDomain: true,
			url: ajaxUrl,
			jsonpCallback: 'setting',
			success: callback
		});
	}
	// for 預設關鍵字實驗
	setDefaultKeyword(setting) {
		if (!setting || !Object.keys(setting)) return;
		const startDate = new Date(setting.response.startDate);
		const nowDate = new Date();
		const nowIndex = Math.floor((nowDate - startDate) / 86400000);
		// 比實驗開始日期早
		if (nowIndex < 0) return;
		// 超過實驗的天數，就停止這項功能
		if (nowIndex >= 0 && nowIndex >= setting.response.duration) return;
		// 判斷起始日是星期幾，根據星期幾建立keyword陣列
		// 開始日期為六日的話，會出錯導致1-2個undefined (要12個關鍵字才夠)
		const pre = startDate.getDay();
		let keywords = [];
		let pointer = 0;
		for (let i = 0; i < setting.response.duration; i++) {
			switch((pre + i) % 7) {
				// 只有週五、週六不會移動指標
				case 5:
				case 6:
					keywords.push(setting.response.buzzwordList[pointer]);
					break;
				default:
					keywords.push(setting.response.buzzwordList[pointer]);
					pointer++;
			}
		}
		if (keywords[nowIndex]) {
			this.setState({ 
				defaultKeyword: keywords[nowIndex],
				placeHolder: keywords[nowIndex],
			});
		}
	}
	render() {
		const { keyword, mode, isOpenFlyout, placeHolder, ACData } = this.state;
		return (
			<div className={ css.search_inner + (keyword ? ' ' + css.on : '') }>
				<div className={ css.search_dropdown }>
					<span onClick={ this.showOption } className={ css.dropdown_button }>
						{ searchModeMap[mode] }
					</span>
					<ul className={ css.dropdown_list + (isOpenFlyout ? ' ' + css.show : '') } >
						{
							Object.keys(searchModeMap).map((option, index) => {
								return <li key={ index } onClick={ this.selectOption.bind(this, option) }>{ searchModeMap[option] }</li>
							})
						}
					</ul>
				</div>
				<TextField
					onBlur={ this.handleBlur }
					name="search"
					value={ keyword }
					placeHolder={ placeHolder }
					onChange={ this.handleSearchKeyPress }
					onKeyDown={ this.handleSearchKeyDown }
					ACData={ ACData }
					onSelected={ this.ACItemSelected }
				/>
				<button className={ 'ui icon button ' + css['search_btn'] }  onClick={ this.handleSearch }>
					<i className={ 'search icon ' + css.search_btn_i } data-gtm-search="搜尋"></i>
				</button>
			</div>
		);
	}
}

export default Search;
