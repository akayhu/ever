import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import $ from 'jquery';
import { TextField } from 'c_wap_module';

// components

// helper functions
function autoComplete(value = '', callback) {
	const ajaxUrl = `/ajax/autoComplete/ability/${value}`;
	$.ajax({
		method: 'get',
		url: ajaxUrl,
		success: callback
	});
}

class EndorsePanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ACData: [],
			ACTypePlaceHolder: '',
			type: '',
			title: props.title || '',
			desc: props.desc || '',
			lightboxLock: false,
			errorMessage: {
				addEndorseInput: '',
				endore_desc: ''
			},
			editAbilityAc: 0,
			disableSubmit: true
		};
		this.handleSubmitToParent = this.handleSubmitToParent.bind(this);
	}
	componentDidMount() {
		const scrollNode = document.scrollingElement || document.documentElement || document.body;
		if (!this.props.simpleMode) {
			this.refs.endorse_edit_main.scrollIntoView();
			scrollNode.scrollTop -= 100;
		}
	}
	handleChangeInput(key, title) {
		this.setState({disableSubmit: true})
		if (title.length > 50) {
			this.state.errorMessage.addEndorseInput = `字數超過上限50字現為${title.length}`;
			this.setState({
				title,
				errorMessage: this.state.errorMessage
			});
			return false;
		}
		this.state.errorMessage.addEndorseInput = '';
		this.setState({ title, errorMessage: this.state.errorMessage });

		autoComplete(title, (res) => {
			const ad_res = [];
			if (res.hasOwnProperty('Result') && res.Result.length > 0) {
				for (let i = 0, arrayLength = res.Result.length; i < arrayLength; i += 1) {
					ad_res.push({
						value: res.Result[i].fun_descript,
						type: res.Result[i].type
					});
				}
			}
			this.setState({	ACData: ad_res });
		});
	}

	handleTextAreaChange(index, desc) {
		if (desc.length > 250) {
			this.state.errorMessage.endore_desc = `字數超過上限250字現為${desc.length}`;
			this.setState({ desc, errorMessage: this.state.errorMessage });
			return false;
		}
		this.state.errorMessage.endore_desc = '';
		this.setState({ desc, errorMessage: this.state.errorMessage });
		this.state.editAbilityAc = 0;
	}
	handleSubmitToParent() {
		const { title, desc, type } = this.state;
		if (title.length === 0) {
			this.state.errorMessage.addEndorseInput = '欄位不可為空';
			return this.setState({errorMessage: this.state.errorMessage});
		}
		if (title.length > 50 || desc.length > 250) return false; // 防呆
		if (this.state.title) {
			this.props.handleSubmit({	title, desc, type	});
			// window._elog.push({
			// 	web: 'plus',
			// 	track: ['editAbility'],
			// 	ext: {
			// 		abilityName: this.state.title,
			// 		pid: this.props.user.pid,
			// 		ac: this.state.editAbilityAc,
			// 		ts: (new Date()).getTime(),
			// 		page: this.state.page
			// 	}
			// });
		} else {
			this.state.errorMessage.addEndorseInput = '欄位不可為空';
			this.setState({errorMessage: this.state.errorMessage});
		}
	}
	handleSelected(value, index) {
		let tempPlaceHolderText;
		this.state.title = this.state.ACData[index - 1].value;
		switch (this.state.ACData[index - 1].type) {
			case 'tool':
				tempPlaceHolderText = '簡單描述你的專長，例如 : PhotoShop，精通，曾獨立製作廣宣海報';
				this.state.type = 'tool';
				break;
			case 'skill':
				tempPlaceHolderText = '簡單描述你的專長或特質，例如 : 品牌行銷管理，中等，曾參與公司品牌再造計畫';
				this.state.type = 'skill';
				break;
			case 'cert':
				tempPlaceHolderText = '簡單描述你的專長，例如 : 國際專案管理師PMP，曾上過相關課程並於2015年取得證照';
				this.state.type = 'cert';
				break;
			case 'lang':
				tempPlaceHolderText = '簡單描述你的語言能力，例如 : 法文，精通，可與當地人口語對話';
				this.state.type = 'lang';
				break;
			default:
				tempPlaceHolderText = '簡單描述你的「專長、特質或證照」的實際案例，讓他人更瞭解你!';
				this.state.type = '';
		}
		this.setState({
			ACTypePlaceHolder: tempPlaceHolderText,
			disableSubmit: false
		});
		this.state.editAbilityAc = 1;
	}
	handleBlur(key, value) {
		this.setState({ACData: []});
	}
	render() {
		const {isEdit, add, viewas, userName, title, desc, handleCancel} = this.props;
		return (
			<div ref="endorse_edit_main" styleName="endorse_body" className={ (this.props.simpleMode) ? css.simple_mode : '' }>
				<div styleName="endorse_title">
					{ add
						? <div>
							<p>項目名稱</p>
							<TextField
								name="addEndorseInput"
								value={ this.state.title }
								onChange={ this.handleChangeInput.bind(this) }
								onBlur={ this.handleBlur.bind(this) }
								ACData={ this.state.ACData }
								placeHolder="請輸入專長、特質或證照的名稱"
								onSelected={ this.handleSelected.bind(this) }
								errorMessage={ this.state.errorMessage.addEndorseInput }
							/>
						</div>
						: <p styleName="no_add_title">
							{ isEdit
									? title
									: `${userName}對於「${title}的自我描述」`
								}
						</p>
					}
				</div>
				{ !isEdit && <p className="body_text">{desc}</p> }
				{ isEdit &&
					<div>
						{ viewas === 'self' && !this.props.simpleMode &&
							<div styleName="endorse_edit_desc">
								<p>內容描述</p>
								<TextField
									name="endore_desc"
									placeHolder={ this.state.ACTypePlaceHolder || '簡單描述你的「專長、特質或證照」的實際案例，讓他人更瞭解你!' }
									onChange={ this.handleTextAreaChange.bind(this) }
									value={ this.state.desc }
									errorMessage={ this.state.errorMessage.endore_desc }
									maxWords={ 250 }
									allowMultiLine
								/>
							</div>
						}
						<button
							className="ui primary button"
							style={ {
								marginRight: '16px',
								border: '1px solid #D0D0D0'
							} }
							onClick={ this.handleSubmitToParent }
							data-gtm-index="儲存 肯定"
							disabled={ viewas === 'self' ? false : this.state.disableSubmit }
						>
							儲存
						</button>
						<button
							className="ui normal button"
							style={ {
								border: '1px solid #D0D0D0',
								color: 'black'
							} }
							onClick={ handleCancel }
							data-gtm-index="略過 肯定"
						>
							{ this.props.cancelButtonText }
						</button>
					</div>
				}
			</div>
		);
	}
}

EndorsePanel.PropTypes = {
	add: PropTypes.bool,
	userName: PropTypes.string,
	type: PropTypes.string,
	title: PropTypes.string,
	desc: PropTypes.string,
	placeholder: PropTypes.string,
	isEdit: PropTypes.bool,
	viewas: PropTypes.string,
	handleSubmit: PropTypes.func,
	handleCancel: PropTypes.func,
	cancelButtonText: PropTypes.string,
	simpleMode: PropTypes.bool,
};

EndorsePanel.defaultProps = {
	cancelButtonText: '取消',
	simpleMode: false
};

export default CSSModules(EndorsePanel, css, {allowMultiple: true});
