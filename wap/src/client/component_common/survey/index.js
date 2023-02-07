import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { Link, browserHistory} from 'react-router';
import { updatePersonalConfig, loadUserConfigByType } from 'src/client/actions/profile';
import clientConfig from 'src/configs/client';
import css from './index.css';

class Survey extends Component {
	constructor( props, context ){
		super( props, context );
		this.state = {};
		this.state.satisfactionConfig = 'a1ec74d4-720e-4fd5-b2d9-921c67b603b3';
		this.state.showSatisfaction = false;
	}
	componentDidMount() {
		let params = {};
		params = {};
		params.pid = this.props.user.pid
		params.typeList = this.state.satisfactionConfig;
		this.props.loadUserConfigByType(params);
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.config !== undefined && this.state.satisfactionConfig in nextProps.config){
			var date = (new Date()).getTime();
			var satisfaction = nextProps.config[this.state.satisfactionConfig];
			var answerTime = satisfaction.value.answerTime || 0;
			var closeTime = satisfaction.value.closeTime || 0;
			
			answerTime = answerTime + 2592000000;//30 day
			closeTime = closeTime + 259200000;//3 day
			
			if (date < answerTime) {
				this.setState({
					showSatisfaction: false
				});
				
				if(this.props.setShowSatisfaction){
					this.props.setShowSatisfaction(false);
				}
				return;
			}
			
			if (closeTime=== 0 || date > closeTime ) {
				this.setState({
					showSatisfaction: true
				});
				if(this.props.setShowSatisfaction){
					this.props.setShowSatisfaction(true);
				}
				return;
			}
		}
	}
	closeSatisfaction () {
		let updateData = [];
		updateData = {};
		updateData.pid = this.props.user.pid;
		updateData.type = this.state.satisfactionConfig;
		updateData.value = {closeTime: new Date().getTime()};
		
		let paramsConfig = {};
		paramsConfig.updateData = JSON.stringify([updateData]);
		paramsConfig.pid = this.props.user.pid;
		
		this.props.updatePersonalConfig(paramsConfig).then(function () {
			this.setState({
				showSatisfaction:false
			});
			if(this.props.setShowSatisfaction){
				this.props.setShowSatisfaction(false);
			}
		}.bind(this));
	}
	handleSatisfaction () {
		let updateData = [];
		updateData = {};
		updateData.pid = this.props.user.pid;
		updateData.type = this.state.satisfactionConfig;
		updateData.value = {answerTime: new Date().getTime(), closeTime: new Date().getTime()};

		let paramsConfig = {};
		paramsConfig.updateData = JSON.stringify([updateData]);
		paramsConfig.pid = this.props.user.pid;
		
		this.props.updatePersonalConfig(paramsConfig).then(function(){
			this.setState({
				showSatisfaction:false
			});
			if(this.props.setShowSatisfaction){
				this.props.setShowSatisfaction(false);
			}
		}.bind(this));
		
		var url = [
			clientConfig.params.surveyUrl,
			this.props.user.pid+"^"+new Date().toISOString().slice(0,8).replace(/-/g,"")
		].join('');
		
		window.open(url, '_blank').focus();
	}
	render(){
		const renderAry = [];

		this.state.showSatisfaction && renderAry.push(
		<div ref="satisfaction" styleName="satisfaction">
			<div>
				<span className="h2">104 職涯社群網站滿意度調查</span>
				<i className="cross icon" onClick={this.closeSatisfaction.bind(this)} data-gtm-index="關閉問卷"></i>
			</div>
			<div styleName="writing">
				邀請您填寫本月問卷，您的回饋，是我們進步的原動力！
				<div styleName="satisfaction_action">
					<button className="ui primary button" onClick={this.handleSatisfaction.bind(this)} href="javascript:;" data-gtm-index="回答問卷">回答問卷</button>
					<button className="ui normal button" onClick={this.closeSatisfaction.bind(this)} href="javascript:;" data-gtm-index="略過問卷">略過</button>
				</div>
			</div>
		</div>)

		return renderAry.shift();
	}
}

function mapStateToProps (state, props) {
	return {
		profile: state.profile.config,
		user: state.user
	}
}

const actions = {updatePersonalConfig, loadUserConfigByType};

export default compose(
	connect(mapStateToProps, actions),
	//translate([]),
	[CSSModules, '_', css]
)(Survey);