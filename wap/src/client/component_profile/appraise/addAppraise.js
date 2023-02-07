/* 送出後加上轉轉小花, 使用者的大頭 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Validators from 'src/util/validator';
import Image from 'src/client/component_common/image';
// components
import { TextField, LightBox } from 'c_wap_module';
// action
import { addAppraiseText } from 'src/client/actions/social';
import compose from 'src/util/compose';

var config = {
		'data': {
			'editor' : [ 'notEmpty', {maxLength: 140}]
		}
}
let val = new Validators(config);

// 發送讚美
class AddAppraise extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {editor: ''},
			loading: false,
			sending: false,
			errorMessage: '',
			showLightBox: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.handleLightBoxCancel = this.handleLightBoxCancel.bind(this);
		this.openAlertLightBox = this.openAlertLightBox.bind(this);
	}
	handleChange(key, value) {
		this.state.data[key] = value;
		this.setState({
			data: this.state.data
		});
	}
	onBlur(key, value) {
		this.state.data[key] = value;
		this.setState({
			data: this.state.data
		});
	}
	handleSubmit() {
		const { targetPid, notLogin, interactionLock } = this.props;
		if (notLogin) return false;
		if (interactionLock) {
			this.openAlertLightBox();
			return false;
		}
		if (this.state.data.editor.length === 0) {
			this.setState({errorMessage: '欄位不可為空'});
			return false;
		}

		if (this.state.data.editor.length > 140) {
			return false;
		}

		this.setState({loading: true}, () => {
			this.refs.submit.classList.add('loading');
		});
		if (!this.state.sending) {
			this.state.sending = true;
			const params = {
				targetPid,
				comment: this.state.data.editor
			};
			this.props.addAppraiseText(params).then(res => {
				if (res.hasOwnProperty('error')) {
					this.refs.submit.classList.remove('loading');
				}
				this.setState({loading: false});
			});
		}
	}
	handleCancel() {
		this.state.data.editor = '';
		this.setState({
			loading: false,
			errorMessage: '',
			data: this.state.data
		});
	}
	openAlertLightBox() {
		this.setState({showLightBox: true});
	}
	handleLightBoxCancel() {
		this.setState({showLightBox: false});
	}

	render() {
		const { notLogin } = this.props;
		const {showLightBox, loading, data: { editor }} = this.state;
		const buttonDisabled = notLogin || loading || editor.length === 0;
		return (
			<div styleName="addMain_box">
				{showLightBox &&
					<LightBox option={{closeIcon: true}} onClose={this.handleLightBoxCancel}>
						<div className="h3">
						預覽模式不提供使用
						</div>
					</LightBox>
				}
				<div styleName="addMain_left">
					<a href={ `/profile/${this.props.user.pid}` }>
						<Image
							type={ 'avatar' }
							alt="user_avatar"
							src={ this.props.user.avatarWebUrl }
						/>
					</a>
				</div>
				<div styleName="addMain_right">
					<TextField
						name="editor"
						value={ this.state.data.editor }
						onChange={ this.handleChange }
						onBlur={ this.onBlur }
						placeHolder="說些讚美的話吧!"
						validator={ val }
						maxWords={ 140 }
						errorMessage={ this.state.errorMessage }
						allowMultiLine
					/>
					<div styleName="add_check_buttons">
						<button
							ref="submit"
							className="ui primary button"
							styleName="add_check_button"
							onClick={ this.handleSubmit }
							disabled={ buttonDisabled }
							data-gtm-profile-social="讚美 - 給予"
						>
							送出
						</button>
						<button
							className="ui normal button"
							styleName="add_check_button"
							onClick={ this.handleCancel }
							disabled={ buttonDisabled }
							data-gtm-profile-social="讚美 - 取消"
						>
							取消
						</button>
					</div>
				</div>
		</div>
		);
	}
}

AddAppraise.propTypes = {
	addAppraiseText: PropTypes.func,
	targetPid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// const AddAppraiseCss = CSSModules(AddAppraise, css, { allowMultiple: true });
// const AddAppraisetTranslate = translate([])(AddAppraiseCss);
// export default connect(mapStateToProps, { addAppraiseText })(AddAppraisetTranslate);

export default compose(
	connect(null, { addAppraiseText }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(AddAppraise);
