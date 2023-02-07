import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import {TextField} from 'c_wap_module';
import $ from 'jquery';
import { getDataList, getIsLoading, getTotal } from 'src/client/reducers/connection';
import css from './index.css';

class AutoCompleteFriendToWhere extends Component {
	constructor(props, context) {
		super(props, context);
		
		this.state={};
		this.state.friendName = "";
		this.state.keyword="";
		this.state.ACData=[];
		this.state.addFriendProcessType = null;
		
		this.elemId = "ac_"+ (Math.round(Math.random() * 2147483647));
		this.timer = null;
		this.keyword="";
		this.keepAlreadyAddList = [];
		this.keepList = this.listGenerator(this.props.data);
	}
	listGenerator(dataList){
		if( dataList.length > 0 ) {
			return dataList.reduce((newAry, item, index) => {
				newAry.push({
					value: item.userName||item.name,
					data: item
				});
				
				return newAry;
			}, []);
		}else {
			return [];
		}
	}
	componentWillReceiveProps(nextProps) {
		if( this.props.data !== nextProps.data ){
			this.keepList = this.listGenerator(nextProps.data);
		}
	}
	createMatch() {
		if(this.keyword){
			const re = new RegExp(this.keyword);
			const afterFilterList = this.keepList.filter((item) => {
				return re.test(item.value) && this.keepAlreadyAddList.indexOf(item.value) === -1;
			});
			this.setState({
				ACData : afterFilterList
			});
		}
	}
	handleBlur() {
		clearTimeout(this.timer);
		this.keyword="";
		this.setState({ACData:[]});
	}
	handleValueChange(value){
		this.keyword = value || "";
		
		this.setState({
			keyword: value
		})

		if(!this.keyword){
			this.handleBlur();
		}
		
		this.timer = setTimeout(() => {
			this.createMatch();
		}, 300);
	}
	handleEventBob(e){
		switch(e.keyCode){
			case 13://enter
				e.target.blur();
				break;
			case 27://esc
				e.target.blur();
				break;
			case 37://left
			
				break;
			case 38://top
			
				break;
			case 39://right
				
				break;
			case 40://down
				this.createMatch();
				break;
		}
		
		//e.preventDefault();
	}
	handleKeyboard(e, value) {
		if(typeof e === 'string'){
			this.handleValueChange(value);
		}else{
			this.handleEventBob(e);	
		}
	}
	handleSelected(value, index){
		//click option
		const data = this.state.ACData[index-1] || {};
		let promise = null;
		
		if(this.props.onChoise){
			promise = this.props.onChoise(data);
			
			if(promise){
				promise.then((result)=> {
					if(result && result.hasOwnProperty("response")){
						if(result.response === true){
							this.keepAlreadyAddList = [data.value, ...this.keepAlreadyAddList];
							this.setState({addFriendProcessType:'Success', friendName:data.value});
						}else{
							this.setState({addFriendProcessType:'Fail'});
						}
					}else{
						this.setState({addFriendProcessType:'Fail'});
					}
					
					setTimeout(()=>{
						$("#"+this.elemId+" .msg").fadeOut(()=>{
							this.setState({addFriendProcessType:null});
						});
					}, 5000);
				});
			}
		}	
		
		this.handleBlur();
		this.setState({addFriendProcessType:'Loading', keyword:" "});
		
		setTimeout(()=>{
			this.setState({keyword:""});
		},0);
	}
	render(){
		return (
			<ul styleName="auto-complete-friend">
				<li id={this.elemId}>
					<TextField
						name="autoCompleteFriend"
						value={this.state.keyword}
						ACData={ this.state.ACData }
						placeHolder="邀請朋友"
						onBlur={ this.handleBlur.bind(this) }
						onChange={ this.handleKeyboard.bind(this) }
						onKeyDown={ this.handleKeyboard.bind(this) }
						onSelected={ this.handleSelected.bind(this) }
					/>
					<div className="msg">{this.state.addFriendProcessType==='Loading' && "請稍等..."}</div>
					<div className="msg">{this.state.addFriendProcessType==='Success' && "邀請已送出"}</div>
					<div className="msg">{this.state.addFriendProcessType==='Fail' && "系統忙碌中，請稍候再試"}</div>
				</li>
			</ul>
		);
	}	
}

AutoCompleteFriendToWhere.defaultProps = {
	onChoise: null
};

AutoCompleteFriendToWhere.propTypes = {
	onChoise: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	const nowState = state.connection;
	
	return {
		data: state.global.myFriendList.list
	};
}

export default compose(
	connect(mapStateToProps),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(AutoCompleteFriendToWhere);