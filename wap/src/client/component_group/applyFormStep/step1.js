import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { applyGroup, setShouldReset } from 'src/client/actions/group';
// data
import { postCategory, degreeData, joinSetUpRadioData, privacyRadioData, joinSetUpRadioPrivateData} from './data';
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

class Step1 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			errorMessage: '',
			shelter: true,
			// parameters
			readedRule: 0,
			name: '',
			category: 1,
			func: '',
			description: '',
			tags: [],
			joinSetting: 0, // 需轉換
			privacy: 8 // 需轉換
		};
		this.checkboxSelect = this.checkboxSelect.bind(this);
		this.onTextFieldChangeWrapper = this.onTextFieldChangeWrapper.bind(this);
		this.degreeStatusChange = this.degreeStatusChange.bind(this);
		this.onDropListSelect = this.onDropListSelect.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	setTag(value) {
		this.setState({ tags: value });
	}
	onTextFieldChangeWrapper(type) {
		return (key, value) => {
			this.setState({
				[type]: value,
			});
		};
	}
	onRadioChangetWrapper(type, props) {
		const privacyValue = props[0].value;
		this.setState({
			[type]: parseInt(privacyValue, 10)
		});
		// 社團隱私設定選私人社團時，新成員加入設定預設為須審核(7)
		// 社團隱私設定選公開社團時，新成員加入設定預設為自由加入(8)
		if (type === 'privacy') {
			switch (privacyValue) {
				case '7':
					this.setState({
						joinSetting: 1
					});
					break;
				case '8':
					this.setState({
						joinSetting: 0
					});
					break;
				default:
					break;
			}
		}
	}
	checkboxSelect(res) {
		this.setState({
			readedRule: res.length,
			shelter: !res.length
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
		const { name, category, func, description, tags, joinSetting, privacy } = this.state;
		const { applyGroup, setShouldReset, stepData, userName } = this.props;

		if (!this.fillAllNeeded()) return;
		const parameters = {
			name,
			description,
			category,
			func,
			joinSetting: privacy === 7 ? 1 : joinSetting,
			type: privacy,
			tags: tags.join(',')
		};

		// dispatch submit action
		applyGroup(parameters)
			.then(({response}) => {
				if (response.hasOwnProperty('error') || response.hasOwnProperty('warning')) {
					const errorMessage = response.error ? response.error.desc : response.warning.desc;
					this.setState({
						loading: false,
						errorMessage
					});
				} else {
					setShouldReset('checking');
					stepData({ ...response, userName });
				}
			});
	}
	fillAllNeeded() {
		const { readedRule,	name, category, description, privacy } = this.state;
		if (!readedRule || !name || !category || !description || !privacy) {
			return false;
		}
		return true;
	}
	render() {
		const { shelter, readedRule,	name, category, func, description, joinSetting, errorMessage, loading, privacy } = this.state;
		const { userName, emailInfo } = this.props;
		const submitDisabled = !this.fillAllNeeded() || loading;
		const fieldDisabled = !readedRule;
		const joinData = privacy === 7 ? joinSetUpRadioPrivateData : joinSetUpRadioData;

		// const shelterStyle = (emailInfo.length > 1 ? 'shelter_two' : 'shelter_one');
		return (
			<div>
				<div styleName="bg_img">
					<img src={ `${clientConfig.params.staticWapUrl}/images/group/step1.png` } />
				</div>
				<div styleName="step_main">
					<table>
						<tbody>
							<tr>
								<td>姓名：</td>
								<td>{ userName }</td>
							</tr>
							{
								emailInfo &&
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
							}
							<tr>
								<td colSpan="2">
									申請成立社團者E-mail須完成驗證才能通過管理員審核；<br />
									若您的E-mail尚未通過驗證請至<a href={ `https:${clientConfig.params.accountsUrl}/hello?p=${this.props.user.aesPid}` }>104會員中心</a>完成驗證。
								</td>
							</tr>
							<tr>
								<td />
								<td>
									<div styleName="radioGroup_style">
										<RadioGroup
											group={ [{ label: '本人已經詳細閱讀', value: true }] }
											name="checkbox"
											onSelected={ this.checkboxSelect }
											checkBox
										/>
									</div>
									<a
										href={ `${clientConfig.params.staticWapUrl}/html/groupStatute/` }
										target="_blank"
										rel="noopener noreferrer"
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
											disabled={ fieldDisabled }
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
											disabled={ fieldDisabled }
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
											defaultIndex={ func }
											styleName="select_style_func"
											disabled={ fieldDisabled }
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
											disabled={ fieldDisabled }
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
										<RadioGroup
											group={
												privacyRadioData.map(item => (item.value === privacy) ? {...item, checked: true} : {...item, checked: false})
											}
											name="radio2"
											onSelected={ this.onRadioChangetWrapper.bind(this, 'privacy') }
											disabled={ fieldDisabled }
										/>
									</td>
								</tr>
								<tr>
									<td><span styleName="need">*</span> 新成員加入設定：</td>
									<td>
										<RadioGroup
											group={
												joinData.map(item => (item.value === joinSetting) ? {...item, checked: true} : {...item, checked: false})
											}
											name="radio"
											onSelected={ this.onRadioChangetWrapper.bind(this, 'joinSetting') }
											disabled={ fieldDisabled }
										/>
									</td>
								</tr>
							</tbody>
						</table>
						{ errorMessage &&
							<div styleName="error_message">{ errorMessage }</div>
						}
						<div styleName="step_button">
							<button
								className="ui primary button"
								onClick={ this.onSubmit }
								disabled={ submitDisabled }
							>
								送出
							</button>
							<button className="ui normal button"><Link to="/group">取消</Link></button>
						</div>
						<div styleName={ shelter ? 'shelter' : '' } />
					</div>
				</div>
			</div>
		);
	}
}

export default compose(
	connect(null, { applyGroup, setShouldReset }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Step1);
