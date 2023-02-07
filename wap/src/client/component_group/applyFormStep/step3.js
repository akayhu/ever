import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { applyGroup } from 'src/client/actions/group';
// data
import { postCategory, degreeData, joinSetUpRadioData, joinSetUpRadioPrivateData, privacyRadioData } from './data';
// components
import { TextField, RadioGroup, DropList } from 'c_wap_module';
import Tag from 'src/client/component_common/tag';
import Validators from 'src/util/validator';
import clientConfig from 'src/configs/client';

const config = {
	data: {
		name: ['notEmpty', { maxLength: 100 }],
		description: ['notEmpty', { maxLength: 1000 }]
	}
};

const val = new Validators(config);

class Step3 extends Component {
	constructor(props) {
		super(props);
		const { groupInfo } = props;
		this.state = {
			loading: false,
			submit: false,
			errorMessage: '',
			// parameters
			readedRule: 1,
			name: groupInfo.name,
			category: groupInfo.category,
			func: groupInfo.function,
			description: groupInfo.description,
			tags: [],
			joinSetting: groupInfo.joinSetting,
			privacy: groupInfo.privacy
		};

		if (!groupInfo.tags.join(',')) {
			this.state.tags = [];
		} else {
			this.state.tags = groupInfo.tags.join(',').split(',');
		}

		this.onTextFieldChangeWrapper = this.onTextFieldChangeWrapper.bind(this);
		this.degreeStatusChange = this.degreeStatusChange.bind(this);
		this.onDropListSelect = this.onDropListSelect.bind(this);
		this.onRadioChangetWrapper = this.onRadioChangetWrapper.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	setTag(value) {
		this.setState({ tags: value });
	}
	onTextFieldChangeWrapper(type) {
		return (key, value) => {
			this.setState({
				[type]: value
			});
		};
	}
	onRadioChangetWrapper(type, props) {
		this.setState({
			[type]: parseInt(props[0].value)
		});
	}
	degreeStatusChange(selectData) {
		this.setState({
			category: selectData.value
		});
	}
	onDropListSelect({value}) {
		this.setState({
			func: value
		});
	}
	onSubmit() {
		const { name, category, func, description, tags, joinSetting } = this.state;
		const { applyGroup, groupInfo: { id } } = this.props;

		if (!this.fillAllNeeded()) return;

		const parameters = {
			channelId: id,
			name,
			description,
			category,
			func,
			joinSetting,
			type: 8,
			tags: tags.join(',')
		};
		// dispatch submit action
		this.setState({ loading: true });
		applyGroup(parameters)
			.then((res) => {
				const response = res.response;
				if (response.hasOwnProperty('error') || response.hasOwnProperty('warning')) {
					this.setState({
						loading: false,
						errorMessage: '修改失敗，請稍後重試'
					});
				} else {
					this.setState({
						loading: false,
						submit: true,
						errorMessage: ''
					});
				}
			});
	}
	fillAllNeeded() {
		const { readedRule,	name, category, description } = this.state;
		if (!readedRule || !name || !category || !description) {
			return false;
		}
		return true;
	}
	render() {
		const { submit,	name, category, func, description, joinSetting, errorMessage, loading, privacy } = this.state;
		const { userName, emailInfo, groupInfo, user } = this.props;
		const submitDisabled = !this.fillAllNeeded() || loading || submit;
		const joinData = groupInfo.type === 7 ? joinSetUpRadioPrivateData : joinSetUpRadioData;

		return (
			<div>
				<div styleName="bg_img">
					<img src={ `${clientConfig.params.staticWapUrl}/images/group/step3.png` } />
				</div>
				<div styleName="step_main">
					<div styleName="management_audit">{ groupInfo.replyMessage }</div>
					<table>
						<tbody>
							<tr>
								<td>姓名：</td>
								<td>{ userName }</td>
							</tr>
							<tr>
								<td>聯絡E-mail：</td>
								<td>
									{emailInfo.map((item, index) => (
										<div key={ index }>
											{ item.email }
											{item.isVerified === 'true'
												? <span styleName="verified">已驗證</span>
												: <span styleName="notVerified">未驗證</span>
											}
										</div>
									))}
								</td>
							</tr>
							<tr>
								<td colSpan="2">
									申請成立社團者E-mail須完成驗證才能通過管理員審核；<br />
								若您的E-mail上通過驗證請至<a href={ `https:${clientConfig.params.accountsUrl}/hello?p=${user.aesPid}` }>104會員中心</a>完成驗證。
								</td>
							</tr>
							<tr>
								<td />
								<td>
									<div styleName="radioGroup_style">
										<RadioGroup
											group={ [{ label: '本人已經詳細閱讀', value: true, checked: true }] }
											checkBox
											disabled
										/>
									</div>
									<a
										href={ `${clientConfig.params.staticWapUrl}/html/groupStatute/` }
										target="_blank"
										rel="noreferrer noopener"
									>
									社團規約
									</a>
									及
									<a
										href={ `${clientConfig.params.staticWapUrl}/html/groupOperation/` }
										target="_blank"
										rel="noopener noreferrer"
									>
										社團經營秘訣
									</a>
								</td>
							</tr>
						</tbody>
					</table>
					<div styleName="shelter-parent">
						<table>
							<tbody>
								<tr>
									<td><span styleName="need">*</span> 社團名稱：</td>
									<td>
										<TextField
											name="name"
											value={ name }
											validator={ val }
											allowMultiLine={ false }
											height={ 200 }
											placeHolder="為你的社團取個名子吧"
											maxWords={ 100 }
											onChange={ this.onTextFieldChangeWrapper('name') }
											onBlur={ this.onTextFieldChangeWrapper('name') }
										/>
									</td>
								</tr>
								<tr>
									<td><span styleName="need">*</span> 社團分類：</td>
									<td>
										<DropList
											listContent={ degreeData }
											onSelected={ this.degreeStatusChange }
											defaultIndex={ category }
											styleName="select_style_category"
										/>
										<i className="help circle icon">
											<div styleName="category_commentary">
												<span styleName="nth">1.知識技術 -</span>
												<span styleName="nth2">EX：行業／產業交流、讀書會、技術討論、活動課程分享、考試證照…等</span>
												<span>2.藝術設計 - EX：展覽、攝影、藝術…等</span>
												<span>3.品味生活 - EX：咖啡、品酒、烹飪…等</span>
												<span>4.健康休閒 - EX：運動、旅遊、公益活動…等</span>
											</div>
										</i>
									</td>
								</tr>
								<tr>
									<td>職務類別：</td>
									<td>
										<DropList
											listContent={ postCategory }
											onSelected={ this.onDropListSelect }
											defaultIndex={ postCategory.findIndex(item => item.label === func) + 1 }
											styleName="select_style_func"
										/>
									</td>
								</tr>
								<tr>
									<td><span styleName="need">*</span> 社團簡介：</td>
									<td>
										<TextField
											name="description"
											value={ description }
											validator={ val }
											allowMultiLine
											height={ 200 }
											placeHolder="請輸入1000個中文字內的社團介紹，讓其他人可以更了解社團經營方向。"
											maxWords={ 1000 }
											onChange={ this.onTextFieldChangeWrapper('description') }
											onBlur={ this.onTextFieldChangeWrapper('description') }
										/>
									</td>
								</tr>
								<tr>
									<td>社團標籤：</td>
									<td>
										<Tag
											tagList={ this.state.tags }
											activitySetTag={ this.setTag.bind(this) }
										/>
									</td>
								</tr>
								<tr>
									<td><span styleName="need">*</span> 社團隱私設定：</td>
									<td>
										{ groupInfo.type === 8 ? '公開社團' : '私人社團'}
									</td>
								</tr>
								<tr>
									<td><span styleName="need">*</span> 新成員加入設定：</td>
									<td>
										<RadioGroup
											group={
												joinData.map((item, index) => (item.value === joinSetting) ? {...item, checked: true} : item)
											}
											name="radio"
											onSelected={ this.onRadioChangetWrapper.bind(this, 'joinSetting') }
										/>
									</td>
								</tr>
							</tbody>
						</table>
						{errorMessage && <div style={ {color: '#fe7e17'} }>{errorMessage}</div>}
						<div styleName="step_button">
							{
								submit
								?	<Link className="ui primary button" to="/group">已送出修改</Link>
								: <div>
									<button
											className="ui primary button"
											onClick={ this.onSubmit }
											disabled={ submitDisabled }
										>
											{errorMessage ? `${errorMessage}` : '修改'}
										</button>
									<Link className="ui button" to="/group">取消</Link>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		userName: state.user.userName,
		user: state.user
	};
}

export default compose(
	connect(null, { applyGroup }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Step3);
