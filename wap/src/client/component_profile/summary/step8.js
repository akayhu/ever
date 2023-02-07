import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField, DropList } from 'c_wap_module';

// 簡介小精靈 step8
class Step8 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				innerEditor1: '',
				innerEditor2: '',
				innerEditor3: ''
			},
			errorMessage: {
				innerEditor1: '',
				innerEditor2: '',
				innerEditor3: ''
			},
			privacySetting: this.props.privacy
		};
		this.privacySettingData = [{ label: '公開', value: 1, iconFont: 'world icon'}, { label: '只限本人', value: 0, iconFont: 'lock icon'}];
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
	jumpUpdate() {
		var publicValue = this.state.privacySetting;
		this.props.editElfSave(7, '');
		this.props.lastStepSubmit(publicValue);
	}
	submitUpdate() {
		var publicValue = this.state.privacySetting;
		if (this.state.data.innerEditor1 && this.state.data.innerEditor2 && this.state.data.innerEditor3) {
			if (this.state.data.innerEditor1.length > 100 || this.state.data.innerEditor2.length > 100 || this.state.data.innerEditor3.length > 100) {
				return false;
			}
			const contentValue = `● 曾想當${this.state.data.innerEditor1}，現在是${this.state.data.innerEditor2}，未來有可能會是${this.state.data.innerEditor3}。`;
			this.props.editElfSave(7, contentValue);
			this.props.lastStepSubmit(publicValue);
		} else {
			if (!this.state.data.innerEditor1) this.state.errorMessage.innerEditor1 = '欄位不可為空';
			if (!this.state.data.innerEditor2) this.state.errorMessage.innerEditor2 = '欄位不可為空';
			if (!this.state.data.innerEditor3) this.state.errorMessage.innerEditor3 = '欄位不可為空';
			this.setState({	errorMessage: this.state.errorMessage	});
		}
	}
	changeStepStatus(type) {
		this.props.updateStepContent('innerEditorContentStep8_1', this.state.data.innerEditor1);
		this.props.updateStepContent('innerEditorContentStep8_2', this.state.data.innerEditor2);
		this.props.changeStepStatus(type);
	}
	privacySettingChange(data) {
		this.setState({privacySetting: data.value});
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
						<div styleName="on_elf_completion on_elf_completion_color on_elf_completion_5_left elf_completion_5_width"></div>
						<div styleName="on_elf_completion on_elf_completion_color on_elf_completion_6_left elf_completion_6_width"></div>
						<div styleName="on_elf_completion on_elf_completion_color on_elf_completion_7_left elf_completion_7_width"></div>
						<div styleName="elf_completion elf_completion_8_width elf_completion_8_right"></div>
					</div>
					<span className="sub_text" styleName="elf_percentage">8 / 8</span>
				</div>
				<div styleName="elf_main_content elf_main_content_8">
					<span className="h2">Step8 你的過去、現在與未來</span>
					<dl>
						<dd>‧ 過去夢想長大後想做的是
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor1"
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor1 }
								/>
							</span>。
						</dd>
						<dd>‧ 我現在的工作是
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor2"
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor2 }
								/>
							</span>。
						</dd>
						<dd>‧ 未來的我將會是
							<span styleName="elf_span_width">
								<TextField
									name="innerEditor3"
									onChange={ this.onChange.bind(this) }
									onBlur={ this.onBlur.bind(this) }
									errorMessage={ this.state.errorMessage.innerEditor3 }
								/>
							</span>。
						</dd>
						<dd>
							<span className="dropListSpan">
								<DropList
									listContent={ this.privacySettingData }
									onSelected={ this.privacySettingChange.bind(this) }
									defaultIndex={ this.props.privacy === 1 ? 1 : 2 }
									width="130px"
									className="dropList"
								/>
							</span>
						</dd>
					</dl>
					<div styleName="btn_content">
						<span styleName="btn_content_span"><button className="ui primary button" onClick={ this.submitUpdate.bind(this) }>完成</button></span>
						<span styleName="btn_content_span"><button className="ui normal button" onClick={ () => this.changeStepStatus('step7') }>回上一題</button></span>
						<span styleName="btn_content_span"><button className="ui normal button" onClick={ this.jumpUpdate.bind(this) }>跳過此題並送出</button></span>
						<span styleName="word_link" onClick={ () => this.changeEditStatus('introduction') }>自行輸入摘要</span>
					</div>
				</div>
			</div>
		)
	}
}

export default CSSModules(Step8, css, { allowMultiple: true });
