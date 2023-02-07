import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { TextField, DropList } from 'c_wap_module';
import Validators from 'src/util/validator';
import { loadProfile, updateUserIntroduction } from 'src/client/actions/profile';
import { queryPrivacyInfo, setPrivacy } from 'src/client/actions/privacy';
import { onchangeFromPromotion, initialFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

const config = {
	data: {
		introduction: ['notEmpty', { maxLength: 1000 }]
	}
};

const val = new Validators(config);

// 個人簡介
class SummaryEditForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			introduction: (this.props.defaultFreekey) ? this.props.defaultFreekey : '',
			privacySetting: this.props.privacySetting,
			errorMessage: '',
			loading: false,
		};
		this.privacySettingData = [{ label: '公開', value: 1, iconFont: 'world icon'}, { label: '只限本人', value: 0, iconFont: 'lock icon'}];
	}
	componentDidMount() {
		const scrollNode = document.scrollingElement || document.documentElement || document.body;
		if (this.props.promotion === 'introduction') {
			this.editFrom.scrollIntoView();
			scrollNode.scrollTop -= 100;
		}
	}
	updateContent() {
		const total = this.state.introduction.replace(/\r?\n|\r|↵/g, '');
		if (total.length === 0) {
			this.setState({errorMessage: '欄位不可為空'});
			return false;
		}
		if (this.state.introduction.length > 1000) {
			this.setState({errorMessage: '字數超過上限'});
			return false;
		}
		this.setState({loading: true});
		this.props.updateUserIntroduction({
			pid: this.props.pid,
			introduction: this.state.introduction,
			privacySetting: this.state.privacySetting
		}).then( () => {
			this.setState({loading: false});
			this.props.setPrivacy({ introduction: this.state.privacySetting});
			this.props.loadProfile({ pid: this.props.pid });
			this.props.updateDefaultFreekey(this.state.introduction);
			this.props.queryPrivacyInfo({targetPid: this.props.pid});
			this.props.initialFromPromotion();
		});
	}
	onChange(key, introduction) {
		this.setState({	introduction });
		this.props.onchangeFromPromotion();
	}
	onBlur(key, introduction) {
		this.setState({	introduction });
	}
	changeEditStatus( e ) {
		var str;
		if( e === 'wizard' ){
			str = this.state.introduction;
		} else {
			str = this.props.profile.introduction;
		}
		this.props.updateDefaultFreekey( str );
		this.props.changeEditStatus( e );
	}
	privacySettingChange(obj) {
		this.setState({ privacySetting: obj.value });
	}
	render() {
		const { loading } = this.state;
		return (
			<div ref={ (editFrom) => { this.editFrom = editFrom; } } className={ (this.props.simpleMode) ? css.simple_mode : '' }>
				<div>
					<TextField
						name="introduction"
						value={ this.state.introduction }
						allowMultiLine
						height={ 100 }
						maxWords={ 1000 }
						placeHolder="用簡短的文字描述你自己，包括你的專長、特質與工作觀。"
						onChange={ this.onChange.bind(this) }
						onBlur={ this.onBlur.bind(this) }
						errorMessage={ this.state.errorMessage }
					/>
				</div>
				<div styleName="dropdown_margin_top" className={ (this.props.simpleMode) ? 'hide' : '' }>
					<span className="dropListSpan">
						<DropList
							listContent={ this.privacySettingData }
							onSelected={ this.privacySettingChange.bind(this) }
							defaultIndex={ this.props.privacySetting === 1 ? 1 : 2 }
							width="130px"
							className="dropList"
						/>
					</span>
				</div>
				<div styleName="btn_content">
					<span styleName="btn_content_span">
						<button className={ (loading) ? 'ui primary button loading' : 'ui primary button' } ref="saveButton" onClick={ this.updateContent.bind(this) } data-gtm-index="儲存 個人摘要">儲存</button>
					</span>
					<span styleName="btn_content_span">
						<button className="ui normal button" onClick={ () => this.changeEditStatus('none') } data-gtm-index="略過 個人摘要">
							{ this.props.cancelButtonText }
						</button>
					</span>
					{/* 考慮日後維護所以先把小幫手註解
					<span
						styleName="word_link"
						onClick={ () => this.changeEditStatus('wizard') }
						className={ (this.props.simpleMode) ? 'hide' : '' }
					>小幫手</span>
					*/}
				</div>
			</div>
		);
	}
}

SummaryEditForm.defaultProps = {
	simpleMode: false,
	cancelButtonText: '取消'
};
SummaryEditForm.propTypes = {
	simpleMode: PropTypes.bool,
	cancelButtonText: PropTypes.string,
};

const action = {
	updateUserIntroduction,
	queryPrivacyInfo,
	loadProfile,
	onchangeFromPromotion,
	initialFromPromotion,
	setPrivacy
};

export default compose(
	connect(null, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SummaryEditForm);
