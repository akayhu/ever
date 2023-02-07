import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { TextField, Tab, Tabs } from 'c_wap_module';
import { resetList } from 'src/client/actions/general';
import hasPermission from 'src/client/services/viewas.js';
import { Link, browserHistory } from 'react-router';
import SearchActivityList from 'src/client/components/searchActivity';
import SearchPeopleList from 'src/client/components/searchPeople';
import config from 'src/configs/client';
import $ from "jquery";

class MSearch extends Component {
	constructor( props ){
		super( props );

		this.timer = null;
		this.modeMap = {
			"公開文章": "activity",
			"人物": "person"
		};
		
		
		var mode = props.params.hasOwnProperty("mode") ? props.params.mode : 'activity';
		
		if(mode !== 'activity' && mode !== 'person'){
			mode = 'activity';
		}
		
		this.state = {
			show: false,
			keyword: "",
			tempKeyword: "",
			mode: 'activity',
			ACData: [],
			inputText: '',
			ACTypePlaceHolder: '',
			title: '',
			errorMessage: { addSearshInput: '' }
		};
	}
	componentWillMount() {
		this.props.resetList({domain:'search', key:'activity'});
		this.props.resetList({domain:'search', key:'person'});
	}
	componentDidMount() {
		setTimeout(() => {
			this.setState({
				show: true
			});
			this.refs.activity.refs.textComponentInput.focus();
			this.refs.activity.refs.textComponentInput.blur();
			
			var mode = 'activity';
			
			if(this.props.params.hasOwnProperty("mode") && (this.props.params.mode === 'activity' || this.props.params.mode === 'person')){
				mode = this.props.params.mode;
			}
			
			if(this.props.params.keyword){
				this.setState({
					mode: mode,
					keyword: this.props.params.keyword,
					tempKeyword: this.props.params.keyword
				});
			}else{
				this.setState({
					mode: mode,
					keyword: "",
					tempKeyword: ""
				});
			}
		}, 500)
	}
	tabChange(prev, next) {
		this.setState({
			mode: this.modeMap[next],
			keyword: "",
			tempKeyword: "",
			ACData: [],
			errorMessage: { 
				addSearshInput: '' 
			}
		}, () => {
			this.refs[this.modeMap[next]].refs.textComponentInput.focus();
			this.refs[this.modeMap[next]].refs.textComponentInput.blur();
		});
	}
	gotoSearch(refName) {
		this.props.router.push("/m/search/"+this.state.mode+"/"+this.refs[refName].state.data);
		this.setState({
			keyword: this.refs[refName].state.data,
			tempKeyword: this.refs[refName].state.data
		})
	}
	autoComplete( value = '', callback ) {
		if(this.state.mode !== 'activity'){
			return;
		}

		let ajaxUrl = config.params.remoteDataUrl+'/ajax/search/activityKeywordSuggest/'+value;

		$.ajax({
			url: ajaxUrl,
			data: {
				keyword: value
			},
			success: function(result){
				callback(result);
			}
		});
	}
	handleChangeInput( key, value ) {
		if(this.state.mode !== 'activity'){
			return;
		}

		this.state.tempKeyword = value;

		// clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.autoComplete( value, (res) => {
				let ad_res = [];
				let ACDATAtemp = [];

				if (typeof res.Result !== 'undefined') {
					ACDATAtemp = res.Result.map(function (item, index){
						return  {value: item};
					});
				}else if (typeof res.response !== 'undefined') {
					ACDATAtemp = res.response.map(function (item, index){
						return  {value: item};
					});
				}

				this.setState({
					// tempKeyword: value,
					ACData : ACDATAtemp
				});
			});
		}, 300);
	}
	handleBlur( key, value ) {
		if(this.state.mode !== 'activity'){
			return;
		}

		this.setState({
			ACData: []
		});
	}
	handleSelected( value, index ) {
		if(this.state.mode !== 'activity'){
			return;
		}

		this.setState({
			keyword: this.state.ACData[index - 1].value,
			tempKeyword: this.state.ACData[index - 1].value,
		});
	}
	createSearchInput(refName, modeName) {
		return (
			<div styleName="input_container">
				<TextField
					ref={refName}
					styleName="input_bar"
					id="addSearshInput"
					name="addSearshInput"
					value={ this.state.tempKeyword }
					onChange={ this.handleChangeInput.bind(this) }
					onBlur={ this.handleBlur.bind(this) }
					onSelected={ this.handleSelected.bind(this) }
					ACData={ this.state.ACData }
					placeHolder={"請輸搜尋的關鍵字"}
					errorMessage={ this.state.errorMessage.addSearshInput }
				/>
				<button onClick={this.gotoSearch.bind(this, refName)} className="ui primary button">
					<i className="search icon" />
				</button>
			</div>
		);
	}
	createTab(modeName, childNode, gtmName) {
		return (
			<Tab name={modeName} data-gtm-search={gtmName}>
				{
					this.createSearchInput.call(this, this.modeMap[modeName], modeName)
				}
				{
					React.createElement(childNode, {
						mode: this.state.mode,
						keyword: this.state.keyword,
						isSearch: true,
						hasButton: true
					})
				}
			</Tab>
		);
	}
	render() {
		return (
			<main styleName="wrap">
				{
					this.state.show &&
					<Tabs onChange={this.tabChange.bind(this)}>
						{this.createTab.call(this, '公開文章', SearchActivityList, '文章 Tab')}
						{this.createTab.call(this, '人物', SearchPeopleList, '人物 Tab')}
					</Tabs>
				}
			</main>
		);
	}
}

// function mapStateToProps(state, props) {
// 	console.log(state);

// 	return {
// 		search: state.search
// 	};
// }

export default compose(
	connect( null, {resetList}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MSearch);
