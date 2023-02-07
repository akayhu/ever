import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';

import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';
import Step6 from './step6';
import Step7 from './step7';
import Step8 from './step8';

import { queryPrivacyInfo } from 'src/client/actions/privacy';
import { loadProfile, updateUserIntroduction } from 'src/client/actions/profile';
import { initialFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

// 簡介小精靈
class SummaryWizard extends React.Component {
	constructor(props) {
		super(props);
		var defaultElf = props.defaultElf;
		this.state = {
			summaryElf: '',
			summaryElfChild: [],
			editElfStatus: 'step1',
			stepContent: {
				innerEditorContentStep1_1: ( defaultElf.innerEditorContentStep1_1 ) ? defaultElf.innerEditorContentStep1_1 : '',
				innerEditorContentStep1_2: ( defaultElf.innerEditorContentStep1_2 ) ? defaultElf.innerEditorContentStep1_2 : '',
				innerEditorContentStep1_3: ( defaultElf.innerEditorContentStep1_3 ) ? defaultElf.innerEditorContentStep1_3 : '',
				innerEditorContentStep2_1: ( defaultElf.innerEditorContentStep2_1 ) ? defaultElf.innerEditorContentStep2_1 : '',
				innerEditorContentStep2_2: ( defaultElf.innerEditorContentStep2_2 ) ? defaultElf.innerEditorContentStep2_2 : '',
				innerEditorContentStep2_3: ( defaultElf.innerEditorContentStep2_3 ) ? defaultElf.innerEditorContentStep2_3 : '',
				innerEditorContentStep3_1: ( defaultElf.innerEditorContentStep3_1 ) ? defaultElf.innerEditorContentStep3_1 : '',
				innerEditorContentStep3_2: ( defaultElf.innerEditorContentStep3_2 ) ? defaultElf.innerEditorContentStep3_2 : '',
				innerEditorContentStep4_1: ( defaultElf.innerEditorContentStep4_1 ) ? defaultElf.innerEditorContentStep4_1 : '',
				innerEditorContentStep4_2: ( defaultElf.innerEditorContentStep4_2 ) ? defaultElf.innerEditorContentStep4_2 : '',
				innerEditorContentStep5_1: ( defaultElf.innerEditorContentStep5_1 ) ? defaultElf.innerEditorContentStep5_1 : '',
				innerEditorContentStep5_2: ( defaultElf.innerEditorContentStep5_2 ) ? defaultElf.innerEditorContentStep5_2 : '',
				innerEditorContentStep6_1: ( defaultElf.innerEditorContentStep6_1 ) ? defaultElf.innerEditorContentStep6_1 : '',
				innerEditorContentStep6_2: ( defaultElf.innerEditorContentStep6_2 ) ? defaultElf.innerEditorContentStep6_2 : '',
				innerEditorContentStep7_1: ( defaultElf.innerEditorContentStep7_1 ) ? defaultElf.innerEditorContentStep7_1 : '',
				innerEditorContentStep7_2: ( defaultElf.innerEditorContentStep7_2 ) ? defaultElf.innerEditorContentStep7_2 : '',
				innerEditorContentStep8_1: ( defaultElf.innerEditorContentStep8_1 ) ? defaultElf.innerEditorContentStep8_1 : '',
				innerEditorContentStep8_2: ( defaultElf.innerEditorContentStep8_2 ) ? defaultElf.innerEditorContentStep8_2 : '',
				innerEditorContentStep8_3: ( defaultElf.innerEditorContentStep8_3 ) ? defaultElf.innerEditorContentStep8_3 : ''
			}
		}
	}
	updateStepContent(typeName, editorContentvalue) {
		this.state.stepContent[typeName] = editorContentvalue;
	}
	editElfSave(index, content) {
		this.state.summaryElfChild[index] = content;
	}
	lastStepSubmit(privacySetting) {
		const { pid } = this.props;
		const introduction = this.introStringCombine();
		this.props.updateUserIntroduction({
			pid, introduction, privacySetting
		}).then(() => {
			this.props.loadProfile({ pid });
			this.props.updateDefaultElf({});
			this.props.queryPrivacyInfo({targetPid: pid});
			this.props.initialFromPromotion();
		});
	}
	introStringCombine() {
		let returnString = '';
		for (let i = 0, sum = this.state.summaryElfChild.length; i < sum; i += 1) {
			returnString += this.state.summaryElfChild[i];
		}
		return returnString;
	}
	changeEditStatus( e ) {
		this.props.changeEditStatus( e );
	}
	updateDefaultElf( str ) {
		var defaultData = this.state.stepContent;
		this.props.updateDefaultElf(defaultData);
	}
	changeStepStatus(type) {
		switch (type) {
			case 'step1':
				this.setState({	editElfStatus: 'step1' });
				break;
			case 'step2':
				this.setState({	editElfStatus: 'step2' });
				break;
			case 'step3':
				this.setState({	editElfStatus: 'step3' });
				break;
			case 'step4':
				this.setState({	editElfStatus: 'step4' });
				break;
			case 'step5':
				this.setState({	editElfStatus: 'step5' });
				break;
			case 'step6':
				this.setState({	editElfStatus: 'step6' });
				break;
			case 'step7':
				this.setState({	editElfStatus: 'step7' });
				break;
			case 'step8':
				this.setState({	editElfStatus: 'step8' });
				break;
			default:
				this.props.changeEditStatus('introduction');
		}
	}
	render() {
		return (
			<div className="body_text" styleName="elf_main">
				{
					this.state.editElfStatus === 'step1' &&
						<Step1
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							stepContentData={ this.state.stepContent }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
				{
					this.state.editElfStatus === 'step2' &&
						<Step2
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							stepContentData={ this.state.stepContent }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
				{
					this.state.editElfStatus === 'step3' &&
						<Step3
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							stepContentData={ this.state.stepContent }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
				{
					this.state.editElfStatus === 'step4' &&
						<Step4
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							stepContentData={ this.state.stepContent }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
				{
					this.state.editElfStatus === 'step5' &&
						<Step5
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							stepContentData={ this.state.stepContent }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
				{
					this.state.editElfStatus === 'step6' &&
						<Step6
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							stepContentData={ this.state.stepContent }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
				{
					this.state.editElfStatus === 'step7' &&
						<Step7
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							stepContentData={ this.state.stepContent }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
				{
					this.state.editElfStatus === 'step8' &&
						<Step8
							editElfSave={ this.editElfSave.bind(this) }
							changeStepStatus={ this.changeStepStatus.bind(this) }
							changeEditStatus={ this.changeEditStatus.bind(this) }
							updateStepContent={ this.updateStepContent.bind(this) }
							lastStepSubmit={ this.lastStepSubmit.bind(this) }
							privacy={ this.props.privacy }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
						/>
				}
			</div>
		);
	}
}

export default compose(
	connect(null, { updateUserIntroduction, queryPrivacyInfo, loadProfile, initialFromPromotion }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SummaryWizard);
