import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import Answer from 'src/client/component_test/industry/answer';
import Report from 'src/client/component_test/industry/report';

import { browserHistory } from 'react-router';
import { LightBox } from 'c_wap_module';

import { checkPiAPI } from 'src/client/actions/test/pi';
import { loadProfile } from 'src/client/actions/profile';

import { bindActionCreators } from 'redux';
import clientConfig from 'src/configs/client';

class Industry extends Component {

	constructor( props, context ){
		super( props, context );
		this.state = {
			exitlightbox: false,
			step: '',
			haveAnswerQuestion: false
		};
		this.redirectStep = this.redirectStep.bind(this);
	}
	componentDidMount() {
		this.props.checkPiAPI({
			pid: this.props.user.pid
		}).then((res) => {
			if(res.errorCode){
				return this.props.router.push("/error/500");
			}
			this.redirectStep(res.status);
		})
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.location.search !== nextProps.location.search) {
			this.setState({
				step: nextProps.location.search
			})
		}
	}
	componentWillUnmount() {
		window.removeEventListener('beforeunload', this.onUnload);
	}
	onUnload(event) {
		// chrome 51之後不再支援dialog顯示文字
		// https://www.chromestatus.com/feature/5349061406228480
		event.returnValue = '';
	}
	redirectStep(status) {
		if (status === 1) {
			this.props.router.push('/test/industry?step=answer');
		} else {
			this.props.router.push('/test/industry?step=report');
		}
		this.setState({
			step: this.props.location.search
		})
	}
	next(step) {
		// 為了第一次進到報告頁切換至其他頁面時不會跳alert
		if (step === 'report') {
			window.removeEventListener('beforeunload', this.onUnload);
		}
		this.props.router.push(`/test/industry?step=${step}`);
	}
	routerWillLeave(nextLocation) {
		this.state.nextLocationPathname = nextLocation.pathname;
		if (this.state.exitlightbox === false && this.props.location.search !== "?step=report" && this.state.haveAnswerQuestion) {
			this.state.exitlightbox = true;
			this.setState(this.state);
			return false;
		}
	}
	goOutside() {
		this.props.router.push(this.state.nextLocationPathname);
	}
	handleAnswerQuestion() {
		// 當是作答狀態時才擋dialog，提醒使用者即將跳出作答頁面
		window.addEventListener('beforeunload', this.onUnload);
		this.setState({
			haveAnswerQuestion: true
		})
	}
	handleExitLightBoxCancel() {
		this.state.exitlightbox = false;
		this.setState(this.state);
	}
	render() {
		let lightboxOption = {
			closeIcon: true,
			submit:{
				text: '確定',
				action: this.goOutside.bind(this)
			},
			cancel:{
				text: '取消'
			}
		};
		return (
			<div>
				{
					this.state.step === "?step=answer" &&
					<Answer
						user={this.props.user}
						location={this.props.location}
						route={this.props.route}
						next={this.next.bind(this)}
						handleAnswerQuestion={this.handleAnswerQuestion.bind(this)} />
				}
				{
					this.state.step === "?step=report" &&
					<Report
						user={this.props.user}
						config={this.props.config} />
				}
				{
					this.state.exitlightbox &&
					<LightBox
						option={lightboxOption}
						onClose={this.handleExitLightBoxCancel.bind(this)}
						>
						<div>
							您還在作答中，確定離開嗎?
						</div>
					</LightBox>
				}
			</div>
		);
	}
}

function mapStateToProps (state, props) {
	return {
		config: state.profile.config,
		user: state.user,
		test: state.test.pi,
	}
}

const actions = {checkPiAPI};
export default compose(
		connect(mapStateToProps, actions),
		//translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Industry);
