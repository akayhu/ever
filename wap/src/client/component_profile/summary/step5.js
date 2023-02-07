import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField } from 'c_wap_module';

// 簡介小精靈 step5
class Step5 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				innerEditor1: this.props.stepContentData.innerEditorContentStep5_1,
				innerEditor2: this.props.stepContentData.innerEditorContentStep5_2
			},
			errorMessage: {
				innerEditor1: '',
				innerEditor2: ''
			}
		};
	}
	onChange(key, value) {
		if (value.length > 100) {
			this.state.data[key] = value;
			this.state.errorMessage[key] = `超過字數上限100字現為${value.length}字`;
			this.setState({errorMessage: this.state.errorMessage});
			return false;
		}
		this.state.data[key] = value;
		this.state.errorMessage[key] = '';
		this.setState({ data: this.state.data,	errorMessage: this.state.errorMessage });
	}
	onBlur(key, value) {
		this.state.data[key] = value;
		this.setState({ data: this.state.data,	errorMessage: this.state.errorMessage	});
	}
	changeEditStatus( e ) {
		this.props.updateDefaultElf();
		this.props.changeEditStatus( e );
	}
	submitUpdate() {
		if( this.state.data.innerEditor1 && this.state.data.innerEditor2 ){
			if (this.state.data.innerEditor1.length > 100 || this.state.data.innerEditor2.length > 100) {
				return false;
			}
			const contentValue = `● 我認為自己是${this.state.data.innerEditor1}的人，在組織團隊中常扮演${this.state.data.innerEditor2}的角色。\n`;
			this.props.editElfSave( 4, contentValue );
			this.props.updateStepContent('innerEditorContentStep5_1', this.state.data.innerEditor1);
			this.props.updateStepContent('innerEditorContentStep5_2', this.state.data.innerEditor2);
			this.props.changeStepStatus('step6');
		} else {
			if (!this.state.data.innerEditor1) this.state.errorMessage.innerEditor1 = '欄位不可為空';
			if (!this.state.data.innerEditor2) this.state.errorMessage.innerEditor2 = '欄位不可為空';
			this.setState({	errorMessage: this.state.errorMessage	});
		}
	}
	jumpUpdate() {
		this.props.editElfSave(4, '');
		this.props.updateStepContent('innerEditorContentStep5_1', this.state.data.innerEditor1);
		this.props.updateStepContent('innerEditorContentStep5_2', this.state.data.innerEditor2);
		this.props.changeStepStatus('step6');
	}
	changeStepStatus(type) {
		this.props.updateStepContent('innerEditorContentStep5_1', this.state.data.innerEditor1);
		this.props.updateStepContent('innerEditorContentStep5_2', this.state.data.innerEditor2);
		this.props.changeStepStatus(type);
	}
	render() {
		return (
			<div>
				<div styleName="elf_completion_main">
					<span className="sub_text" styleName="elf_left">進度</span>
					<div styleName="elf_completion_bg">
						<div styleName="on_elf_completion elf_completion_1_width"></div>
						<div styleName="on_elf_completion on_elf_completion_color on_elf_completion_2_left elf_completion_2_width"></div>
						<div styleName="on_elf_completion on_elf_completion_color on_elf_completion_3_left elf_completion_3_width"></div>
						<div styleName="on_elf_completion on_elf_completion_color on_elf_completion_4_left elf_completion_4_width"></div>
						<div styleName="elf_completion elf_completion_5_width elf_completion_5_right"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_6_left un_elf_completion_6_zIndex elf_completion_6_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_7_left un_elf_completion_7_zIndex elf_completion_7_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_8_left un_elf_completion_8_zIndex elf_completion_8_width"></div>
					</div>
					<span className="sub_text" styleName="elf_percentage">5 / 8</span>
				</div>
				<div styleName="elf_main_content elf_main_content_5">
					<span className="h2">Step5 我心中的我</span>
					<dl>
						<dd>‧ 我覺得我是
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor1"
									value={ this.props.stepContentData.innerEditorContentStep5_1 }
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor1 }
								/>
							</span>
							，的人。
						</dd>
						<dd>‧ 我在組織團隊中常扮演
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor2"
									value={ this.props.stepContentData.innerEditorContentStep5_2 }
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor2 }
								/>
							</span>
							的角色。
						</dd>
					</dl>
					<div styleName="btn_content">
						<span styleName="btn_content_span"><button className="ui primary button" onClick={ this.submitUpdate.bind(this) }>下一題</button></span>
						<span styleName="btn_content_span"><button className="ui normal button" onClick={ ()=>this.changeStepStatus( 'step4' ) }>回上一題</button></span>
						<span styleName="btn_content_span"><button className="ui normal button" onClick={ this.jumpUpdate.bind(this) }>跳過此題</button></span>
						<span styleName="word_link" onClick={ ()=>this.changeEditStatus( 'introduction' ) }>自行輸入摘要</span>
					</div>
				</div>
			</div>
		)
	}
}

export default CSSModules(Step5, css, { allowMultiple: true });
