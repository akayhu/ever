import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { initApplyGroup } from 'src/client/actions/group';
// components
import Step1 from 'src/client/component_group/applyFormStep/step1';
import Step2 from 'src/client/component_group/applyFormStep/step2';
import Step3Wrapper from 'src/client/component_group/applyFormStep/step3Wrapper';
import {components as CPlatformComponents} from 'c_platform';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class ApplyForm extends Component {
	constructor(props) {
		super(props);
		// 從社團列表頁連過來才會有location.state.step
		let step = 'step1';

		if (props.location.state) {
			step = this.props.location.state.step;
		}
		this.state = {
			applyGroupData: {},
			applyFormStatus: step,
			emailInfo: []
		};

		this.stepData = this.stepData.bind(this);
	}
	componentDidMount() {
		this.props.initApplyGroup().then((result) => {
			this.setState({
				emailInfo: this.getEmailInfo(result)
			});
		});
	}
	getEmailInfo(infoFromAc) {
		return infoFromAc.data.reduce((final, { email, isVerified, isMain }) => {
			if (isMain === 'true') {
				final.push({ email, isVerified });
			}
			return final;
		}, []);
	}
	stepData(applyGroupData) {
		this.setState({
			applyGroupData,
			applyFormStatus: 'step2'
		});
	}
	render() {
		const { applyFormStatus, applyGroupData, emailInfo } = this.state;
		// 從社團列表頁連過來才會有location.state.groupInfo
		const {userName, user} = this.props;
		let groupInfo;
		if (this.props.location.state) {
			groupInfo = this.props.location.state.groupInfo;
		}
		
		return (
			<ViewWrapper { ...this.props }>
				<div className="container_wrap">
					<div styleName="apply_form">
						<div className="h3" styleName="apply_form_title">建立新社團</div>
						{
							applyFormStatus === 'step1' &&
							<Step1
								user={ user }
								userName={ userName }
								emailInfo={ emailInfo }
								stepData={ this.stepData }
							/>
						}
						{
							applyFormStatus === 'step2' &&
							<Step2
								userName={ userName }
								emailInfo={ emailInfo }
								applyGroupData={ groupInfo || applyGroupData }
							/>
						}
						{
							applyFormStatus === 'step3' &&
							<Step3Wrapper
								userName={ userName }
								emailInfo={ emailInfo }
								groupInfo={ groupInfo }
								// 從通知列表來的只有channelId
								channelId={ groupInfo ? groupInfo.id : this.props.location.state.channelId }
								user={ this.props.user }
							/>
						}
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		userName: state.user.userName,
		user: state.user
	};
}

const actions = {
	initApplyGroup
};

export default compose(
	connect(mapStateToProps, actions),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ApplyForm);
