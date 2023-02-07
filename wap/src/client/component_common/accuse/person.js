import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import compose from 'src/util/compose';
import css from './person.css';
//TextField
import { LightBox, TextField, RadioGroup } from 'c_wap_module';

import clientConfig from 'src/configs/client';
import { accuseTrigger, accuseTerriblePerson } from 'src/client/actions/accuse';

import Validators from 'src/util/validator';
import {actions as CPlatformActions} from "c_platform";
const CPlatformActionsAlert = CPlatformActions.alert;

var config = {
    'data': {
      'editor' : [ 'notEmpty', {maxLength: 500}]
    }
}
let val = new Validators(config);

class AccusePerson extends Component {
	constructor(){
		super();
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
	pageChange(value) {
    if(this.checkFields() || value === 1){
    	this.setState({ 
				page: value , 
				errorMsg: "" 
			});
    }
	}
	lightboxClose() {
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
	accuseSubmit() {
		if(this.checkFields()){
			const targetPid = this.props.accuse.accuseData.pid;
			this.setState({accuseDisable: true});
			var selection = this.state.selection.map(obj => { return obj.value/1; });
			this.props.accuseTerriblePerson( selection, this.state.comment ).then( res => {
				this.lightboxClose();
				if(!res.hasOwnProperty('errorCode')){
					this.props.showAlert('','','你的檢舉已送出，我們將儘速幫你處理');
				}
				this.setState({accuseDisable: false});				
			});
		}
	}
	render() {
		if(this.props.accuse.hasOwnProperty('accuseClass') && this.props.accuse.accuseClass !== 'none'){
			const lightboxOption = {
				closeIcon: true,
				title: '我要檢舉'
			};
			
			const group = this.props.accuse.accuseItem.user.map((item) => {
				return this.state.selectionValue.indexOf(item.value) === -1 ? {...item, checked: false} : {...item, checked: true};
			});
			return (
				<LightBox option={lightboxOption} onClose={this.lightboxClose.bind(this)}>
					<div styleName="report_main">
						{
							this.state.page === 1 &&
						  <div styleName="text_main">
								<p>我要檢舉相關內容，因為：</p>
								<div styleName="report_checkBox">
									<RadioGroup
										group={group}
										name="checkbox"
										onSelected={this.checkBoxSelect.bind(this)}
										checkBox={true}
										maxChoose={3}>
									</RadioGroup>
								</div>
							</div>
						}
						{
							this.state.page === 2 &&
			        <div styleName="text_main">
								<p>請具體說明舉證：</p>
								<div styleName="report_text">
									<TextField
										name="editor"
										value={ this.state.comment }
										onChange={ this.commentChange.bind(this) }
										onBlur={ this.commentChange.bind(this) }
										placeHolder="請輸入舉證內容"
										validator={ val }
										height={200}
										allowMultiLine={ true }
										maxWords={ 500 }
									/>
								</div>
							</div>
						}
						<div styleName="error_message">{this.state.errorMsg}</div>
						<div styleName="btn_row">
							{
								this.state.page === 1 &&
								<div>
									<button styleName="button" className="ui primary button" onClick={this.pageChange.bind(this, 2)}> 下一步 </button>
									<button styleName="button" className="ui normal button" onClick={ this.lightboxClose.bind(this) }>取消</button>
								</div>
							}
							{
								this.state.page === 2 &&
								<div>
									<button styleName="button" className="ui primary button" disabled={this.state.accuseDisable} onClick={this.accuseSubmit.bind(this)}>確定檢舉</button>
									<button styleName="button" className="ui normal button" onClick={this.pageChange.bind(this, 1)} >上一步 </button>
									<button styleName="button" className="ui normal button" onClick={ this.lightboxClose.bind(this) }>取消</button>
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
	connect(mapStateToProps, { accuseTrigger, accuseTerriblePerson, showAlert:CPlatformActionsAlert.showAlert }),
	//translate([]),
	[CSSModules, '_', css]
)(AccusePerson);
