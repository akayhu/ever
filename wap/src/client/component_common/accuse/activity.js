import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './activity.css';
import { LightBox, TextField, RadioGroup } from 'c_wap_module';
//import $ from 'jquery';
import clientConfig from 'src/configs/client';
import { accuseTrigger, accuseTerribleActivity } from 'src/client/actions/accuse';
import { deleteAccuseActivity, deleteAccuseComment } from 'src/client/actions/activity';

import Validators from 'src/util/validator';
import {actions as CPlatformActions} from "c_platform";
const CPlatformActionsAlert = CPlatformActions.alert;

var config = {
    'data': {
      'editor' : [ 'notEmpty', {maxLength: 500}]
    }
}
let val = new Validators(config);

// 新增區塊
class AccuseActivity extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,
			selection: [],
			selectionValue: [],
			comment: "",
			errorMsg1: "",
			errorMsg2: "",
			accuseDisable: false
		}
	}
	checkBoxSelect(selection){
		const selectionValue = selection.map(item => { return item.value/1; });
		this.setState({
			selection: selection, 
			selectionValue: selectionValue, 
			errorMsg1: ""
		});
	}
	commentChange( key, value ){
		this.setState({
			comment: value
		});
	}
	checkFields() {
		if(this.state.selection.length === 0){
			this.setState({
				errorMsg1: "請至少選擇一樣"
			});
			return false;
		}
		
		if(this.state.page === 2 && this.state.comment.length === 0){
			this.setState({
				errorMsg2: "請輸入舉證內容"
			});
			return false;
		}
		
		if(this.state.page === 2 && this.state.comment.length > 500){
			this.setState({
				errorMsg2: `內文長度上限500字，現為${this.state.comment.length}字`
			});
			return false;
		}
		
		return true;
	}
	pageChange(value){
		if(this.checkFields() || value === 1){
			this.setState({ 
				page: value , 
				errorMsg: "" 
			});
		}
	}
	lightboxClose(){
		this.props.accuseTrigger( 'none', {} );
		this.setState({
			page: 1,
			selection: [],
			selectionValue: [],
			comment: "",
			errorMsg: ""
		});
		
		if(this.props.onClose){
			this.props.onClose();
		}
	}
	accuseSubmit(){
		if(this.checkFields()){
			this.setState({accuseDisable: true});
			const accuseData = this.props.accuse.accuseData;
			const index = accuseData.index;
			const selection = this.state.selection.map(obj => { return obj.value/1; });

			this.props.accuseTerribleActivity( selection, this.state.comment ).then( res => {
				this.lightboxClose();
				
				if(!res.hasOwnProperty('errorCode')){
					this.props.showAlert('','','你的檢舉已送出，我們將儘速幫你處理');
				}
				
				if(accuseData.aidParent){
					this.props.deleteAccuseComment(accuseData);
				}else{
					/*  BIGC-1533 移除「檢舉文章，文章會消失」之功能 */
					// this.props.deleteAccuseActivity(accuseData);
				}
				this.setState({accuseDisable: false});				
			});
		}
	}
	render() {
		if(this.props.accuse.hasOwnProperty('accuseClass') && this.props.accuse.accuseClass !== 'none'){
			const lightboxOption = {
				closeIcon: true,
				title: "我要檢舉"
			}
			
			const group = this.props.accuse.accuseItem.activity.map((item) => {
				return this.state.selectionValue.indexOf(item.value) === -1 ? {...item, checked: false} : {...item, checked: true};
			});
			
			return (
				<LightBox option={lightboxOption} onClose={this.lightboxClose.bind(this)} clickOverlayToClose={false}>
					<div styleName="report_main">
						{
							this.state.page === 1 &&
							<div styleName="page_block">
								<div styleName="subtitle" >我要檢舉相關內容，因為：</div>
								<RadioGroup
									group={group}
									name="radio"
									onSelected={this.checkBoxSelect.bind(this)}
									checkBox={true}
									styleName={"radioGroup"}
									maxChoose={3}>
								</RadioGroup>
							</div>
						}
						{
							this.state.page === 2 &&
							<div styleName="page_block">
								<div styleName="subtitle" >請具體說明舉證：</div>
								<div styleName="textfield_container">
									<TextField
										name="comment"
										value={ this.state.comment }
										placeHolder="請輸入舉證內容~"
										onChange={this.commentChange.bind(this)}
										onBlur={this.commentChange.bind(this)}
										validator={ val }
										height={200}
										allowMultiLine={ true }
										maxWords={ 500 }
									/>
								</div>
							</div>
						}
						<div styleName="btn_row">
							{
								this.state.page === 1 &&
								<div>
									<div styleName="error_message">{this.state.errorMsg1}</div>
									<button className="ui primary button" onClick={this.pageChange.bind(this, 2)}> 下一步 </button>
									<button className="ui normal button" onClick={ this.lightboxClose.bind(this) }>取消</button>
								</div>
							}
							{
								this.state.page === 2 &&
								<div>
									<div styleName="error_message">{this.state.errorMsg2}</div>
									<button className="ui primary button" disabled={this.state.accuseDisable} onClick={this.accuseSubmit.bind(this)}>確定檢舉</button>
									<button className="ui normal button" onClick={this.pageChange.bind(this, 1)} >上一步 </button>
									<button className="ui normal button" onClick={ this.lightboxClose.bind(this) }>取消</button>
								</div>
							}
						</div>
					</div>
				</LightBox>
			);
		}else {
			return null;
		}
	}
}

function mapStateToProps (state, props) {
	return {
		accuse: state.accuse
	}
}

export default compose(
	connect(mapStateToProps, { accuseTrigger, accuseTerribleActivity, deleteAccuseActivity, deleteAccuseComment, showAlert:CPlatformActionsAlert.showAlert }),
	//translate([]),
	[CSSModules, '_', css]
)(AccuseActivity);