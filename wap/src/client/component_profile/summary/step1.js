import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField } from 'c_wap_module';

// 簡介小精靈 step1
class Step1 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				innerEditor1: this.props.stepContentData.innerEditorContentStep1_1,
				innerEditor2: this.props.stepContentData.innerEditorContentStep1_2,
				innerEditor3: this.props.stepContentData.innerEditorContentStep1_3
			},
			errorMessage: {
				innerEditor1: '',
				innerEditor2: '',
				innerEditor3: ''
			}
		}
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
		if (this.state.data.innerEditor1 && this.state.data.innerEditor2 && this.state.data.innerEditor3) {
			if (this.state.data.innerEditor1.length > 100 || this.state.data.innerEditor2.length > 100 || this.state.data.innerEditor3.length > 100) {
				return false;
			}
			const contentValue = `● 我過去最具代表性的經歷是任職${this.state.data.innerEditor3}年的${this.state.data.innerEditor1}公司之${this.state.data.innerEditor2}職務。\n`;
			this.props.editElfSave(0, contentValue);
			this.props.updateStepContent('innerEditorContentStep1_1', this.state.data.innerEditor1);
			this.props.updateStepContent('innerEditorContentStep1_2', this.state.data.innerEditor2);
			this.props.updateStepContent('innerEditorContentStep1_3', this.state.data.innerEditor3);
			this.props.changeStepStatus('step2');
		} else {
			if (!this.state.data.innerEditor1) this.state.errorMessage.innerEditor1 = '欄位不可為空';
			if (!this.state.data.innerEditor2) this.state.errorMessage.innerEditor2 = '欄位不可為空';
			if (!this.state.data.innerEditor3) this.state.errorMessage.innerEditor3 = '欄位不可為空';
			this.setState({	errorMessage: this.state.errorMessage	});
		}
	}
	jumpUpdate() {
		this.props.editElfSave(0, '');
		this.props.updateStepContent('innerEditorContentStep1_1', this.state.data.innerEditor1);
		this.props.updateStepContent('innerEditorContentStep1_2', this.state.data.innerEditor2);
		this.props.updateStepContent('innerEditorContentStep1_3', this.state.data.innerEditor3);
		this.props.changeStepStatus('step2');
	}
	render() {
		return (
			<div>
				<div styleName="elf_completion_main">
					<span className="sub_text" styleName="elf_left">進度</span>
					<div styleName="elf_completion_bg">
						<div styleName="elf_completion_1 elf_completion_1_right un_elf_completion_1_zIndex elf_completion_1_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_2_left un_elf_completion_2_zIndex elf_completion_2_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_3_left un_elf_completion_3_zIndex elf_completion_3_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_4_left un_elf_completion_4_zIndex elf_completion_4_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_5_left un_elf_completion_5_zIndex elf_completion_5_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_6_left un_elf_completion_6_zIndex elf_completion_6_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_7_left un_elf_completion_7_zIndex elf_completion_7_width"></div>
						<div styleName="un_elf_completion un_elf_completion_color un_elf_completion_8_left un_elf_completion_8_zIndex elf_completion_8_width"></div>
					</div>
					<span className="sub_text" styleName="elf_percentage">1 / 8</span>
				</div>
				<div styleName="elf_main_content elf_main_content_1">
					<span className="h2">Step1 最具代表性的經歷</span>
					<dl>
						<dd>‧ 在過去經歷中，我最具代表性的一段經歷是在
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor1"
									value={ this.props.stepContentData.innerEditorContentStep1_1 }
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor1 }
								/>
							</span>
							公司
						</dd>
						<dd>‧ 擔任
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor2"
									value={ this.props.stepContentData.innerEditorContentStep1_2 }
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor2 }
								/>
							</span>
							的時候，
						</dd>
						<dd>‧ 我待了
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor3"
									value={ this.props.stepContentData.innerEditorContentStep1_3 }
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor3 }
								/>
							</span>
							年
						</dd>
					</dl>
					<div styleName="btn_content">
						<span styleName="btn_content_span"><button className="ui primary button" onClick={ this.submitUpdate.bind(this) }>下一題</button></span>
						<span styleName="btn_content_span"><button className="ui normal button" onClick={ this.jumpUpdate.bind(this) }>跳過此題</button></span>
						<span	styleName="word_link"	onClick={ () => this.changeEditStatus('introduction') }>自行輸入摘要</span>
					</div>
				</div>
			</div>
		);
	}
}

export default CSSModules(Step1, css, { allowMultiple: true });
