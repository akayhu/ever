import { connect } from 'react-redux';
import React, {Component} from 'react';
import { findDOMNode } from 'react-dom';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import hasPermission from 'src/client/services/viewas.js';
import ChronicleItem from './item';
import ChronicleItemHonor from './itemHonor';
import ChronicleEditFormExp from './editformExp';
import ChronicleEditFormEdu from './editformEdu';
import ChronicleEditFormHonor from './editformHonor';
// import HintBox from './changePrivacyBlockHint';
import PersonalInfoComponentTitle from 'src/client/component_profile/title/personalInfo';

import { loadChronicle, alertCheckEffectLightbox } from 'src/client/actions/chronicle';
import { createFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

class Chronicle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showAllFlag: {
				exp: true,
				edu: true,
				honor: true
			}
		};
		// 判斷資料載完了沒有
		this.fetchFinished = false;
	}
	componentDidMount() {
		this.fetchFinished = false;
		this.props.loadChronicle({pid: this.props.user.pid, targetPid: this.props.params.pid})
			.then(() => {this.fetchFinished = true;});
	}
	componentWillReceiveProps({anchorTo}) {
		if (anchorTo !== this.props.anchorTo) {
			this.scrollInto({blockName: anchorTo});
		}
	}
	scrollInto({blockName, node, times = 10}) {
		if (times <= 0) return;
		if (!node && blockName === 'honor') {
			node = findDOMNode(this.honorBlock);
		}
		if (node) {
			if (!this.fetchFinished) {
				// 若是資料還沒載完，等200毫秒後重試;
				setTimeout(() => this.scrollInto({blockName, node, times: times - 1}), 200);
			} else {
				node.scrollIntoView();
			}
		} else {
			// 節點還沒產生，重新執行
			setTimeout(() => this.scrollInto({blockName, times: times - 1}), 200);
		}
	}
	createNewChronicle(e) {
		this.props.createFromPromotion({ promotion: e });
	}
	showAllFlag(keyName) {
		this.state.showAllFlag[keyName] = !this.state.showAllFlag[keyName];
		this.setState({showAllFlag: this.state.showAllFlag});
	}
	render() {
		const exp = (this.props.viewas === 'self') ? this.props.chronicle.exp : this.props.chroniclePublicView.exp;
		const edu = (this.props.viewas === 'self') ? this.props.chronicle.edu : this.props.chroniclePublicView.edu;
		const honor = (this.props.viewas === 'self') ? this.props.chronicle.honor : this.props.chroniclePublicView.honor;
		// const lightboxObtion = {
		// 	title: `是否開啟${this.props.chroniclePrivacySettingName}區塊`
		// };  Phase 2 用的
		return (
			<div>
				{
					hasPermission(this.props.viewas, this.props.privacy.experience, this.props.pid, this.props.params.pid) &&
					<div>
						<div id="experience" name="experience">
							{
								(exp.length > 0 || this.props.promotion === 'experience') &&
								<div styleName="exp_title">
									<PersonalInfoComponentTitle
										ontopButton={ false }
										createButton={ this.props.viewas === 'self' }
										maintitle="經歷"
										textAlign="center"
										userPid={ this.props.user.pid }
										params={ this.props.params }
										privacy={ this.props.privacy.experience }
										privacyText="experience"
										viewas={ this.props.viewas }
										showPrivacySetting={ this.props.viewas === 'self' }
										addBtnClick={ () => this.createNewChronicle('experience') }
										gtmValue="新增經歷"
										gtmTitleName="經歷隱私"
									/>
								</div>
							}
							{
								this.props.promotion === 'experience' &&
								<ChronicleEditFormExp
									editformClass="add"
									params={ this.props.params }
									user={ this.props.user } />
							}
							{
								exp.map((obj, index) => {
									let isFirst = false;
									if (index === 0) {
										isFirst = true;
									}
									const showCircle = (index === 0) ? true : this.props.chronicle.exp[index].startYear !== this.props.chronicle.exp[index - 1].startYear;
									if (index < 2 || !this.state.showAllFlag.exp) {
										return (
											<ChronicleItem
												key={ obj.eventId }
												index={ index }
												itemData={ obj }
												isFirst={ isFirst }
												params={ this.props.params }
												user={ this.props.user }
												viewas={ this.props.viewas }
												chronicle={ this.props.chronicle }
												promotion={ this.props.promotion }
												showCircle={ showCircle }
											/>
										);
									}
								})
							}
							{
								(exp.length > 2 && this.state.showAllFlag.exp) &&
									<div styleName="readmore" onClick={ () => this.showAllFlag('exp') }>
										<div styleName="readmoreBtn">共 {exp.length} 筆經歷全部展開</div>
									</div>
							}
						</div>
						{
							exp.length > 0 &&
							<hr styleName="chronicle_hr" />
						}
					</div>
				}
				{
					hasPermission(this.props.viewas, this.props.privacy.education, this.props.pid, this.props.params.pid) &&
					<div>
						<div id="education" name="education">
							{
							(edu.length > 0 || this.props.promotion === 'education') &&
							<div styleName="edu_title">
								<PersonalInfoComponentTitle
									ontopButton={ false }
									createButton={ this.props.viewas === 'self' }
									maintitle="學歷"
									textAlign="center"
									userPid={ this.props.user.pid }
									params={ this.props.params }
									privacy={ this.props.privacy.education }
									privacyText="education"
									viewas={ this.props.viewas }
									showPrivacySetting={ this.props.viewas === 'self' }
									addBtnClick={ () => this.createNewChronicle('education') }
									gtmValue="新增學歷"
									gtmTitleName="學歷隱私"
								/>
							</div>
							}
							{this.props.promotion === 'education' &&
								<ChronicleEditFormEdu editformClass="add"  user={ this.props.user } />
							}
							{
								edu.map((obj, index) => {
									const showCircle = (index === 0) ? true : this.props.chronicle.edu[index].startYear !== this.props.chronicle.edu[index - 1].startYear;
									if (index < 2 || !this.state.showAllFlag.edu) {
										return (
											<ChronicleItem
												key={ obj.eventId }
												index={ index }
												itemData={ obj }
												params={ this.props.params }
												user={ this.props.user }
												viewas={ this.props.viewas }
												promotion={ this.props.promotion }
												showCircle={ showCircle }
											/>
										);
									}
								})
							}
							{
								edu.length > 2 && this.state.showAllFlag.edu &&
								<div styleName="readmore" onClick={ () => this.showAllFlag('edu') }>
									<div styleName="readmoreBtn">共 {edu.length} 筆學歷全部展開</div>
								</div>
							}
						</div>
						{
							edu.length > 0 &&
							<hr styleName="chronicle_hr" />
						}
					</div>
				}
				{
					hasPermission(this.props.viewas, this.props.privacy.honor, this.props.pid, this.props.params.pid) &&
					<div>
						<div id="honor" name="honor">
							{
							(honor.length > 0 || this.props.promotion === 'honor') &&
							<div styleName="honor_title">
								<PersonalInfoComponentTitle
									ref={ ref => (this.honorBlock = ref) }
									ontopButton={ false }
									createButton={ this.props.viewas === 'self' }
									maintitle="職涯成就"
									textAlign="left"
									userPid={ this.props.user.pid }
									params={ this.props.params }
									privacy={ this.props.privacy.honor }
									privacyText="honor"
									viewas={ this.props.viewas }
									showPrivacySetting={ this.props.viewas === 'self' }
									addBtnClick={ () => this.createNewChronicle('honor') }
									gtmValue="新增職涯成就"
									gtmTitleName="職涯成就隱私"
								/>
							</div>
							}
							{/* {
								this.props.promotion === 'honor' &&
								<ChronicleEditFormHonor editformClass="add" user={ this.props.user } chronicle={ this.props.chronicle } />
							} */}
							{
								honor.map((obj, index) => {
									if (index < 2 || !this.state.showAllFlag.honor) {
										return (
											<ChronicleItemHonor
												key={ obj.eventId }
												index={ index }
												tag={ obj.tagList ? obj.tagList[0] : [] }
												itemData={ obj }
												params={ this.props.params }
												user={ this.props.user }
												viewas={ this.props.viewas }
												chronicle={ this.props.chronicle }
												promotion={ this.props.promotion }
											/>
										);
									}
								})
							}
							{
								honor.length > 2 && this.state.showAllFlag.honor &&
									<div styleName="readmore" onClick={ () => this.showAllFlag('honor') }>
										<div styleName="readmoreBtn">共 {honor.length} 筆全部展開</div>
									</div>
							}
						</div>
						{
							honor.length > 0 &&
							<hr styleName="chronicle_honor_hr" />
						}
					</div>
				}
			</div>
		);
	}
}

const chronicleShowProcessing = (exp, edu, honor = []) => {
	const newExpArray = exp.filter((obj) => { return (obj.privacySetting === 1); });
	const newEduArray = edu.filter((obj) => { return (obj.privacySetting === 1); });
	const newHonorArray = honor.filter((obj) => { return (obj.privacySetting === 1); });
	return {
		exp: newExpArray,
		edu: newEduArray,
		honor: newHonorArray
	};
};

function mapStateToProps(state, props) {
	return {
		user: state.user,
		chronicle: state.chronicle,
		privacy: state.privacy,
		viewas: state.profile.viewas || 'other',
		promotion: state.global.promotion,
		chroniclePublicView: chronicleShowProcessing(state.chronicle.exp, state.chronicle.edu, state.chronicle.honor)
	};
}

const action = { loadChronicle, createFromPromotion, alertCheckEffectLightbox };

export default compose(
	connect(mapStateToProps, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Chronicle);
