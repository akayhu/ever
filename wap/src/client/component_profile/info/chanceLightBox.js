import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './lightBox.css';
import SwtichButton from 'src/client/component_common/switchButton';
import { LightBox } from 'c_wap_module';
import { queryPrivacyInfo, setPrivacy, updatePrivacy } from 'src/client/actions/privacy';

class ChanceLightBox extends Component {
	constructor(props){
		super(props);
		this.state = {};
		this.state.privacy = {};
		this.state.privacy.introduction = this.state.privacy.introduction;
		this.state.privacy.education = this.state.privacy.education;
		this.state.privacy.experience = this.state.privacy.experience;
		this.state.privacy.honor = this.state.privacy.honor;
		this.state.privacy.gallery = this.state.privacy.gallery;
		this.state.privacy.endorse = this.state.privacy.endorse;
		this.state.privacy.appraise = this.state.privacy.appraise;
	}
	handleLightBoxSubmit(){
		let that = this;
		let params = {};//this.state.privacy;
		params.pid = this.props.privacy.pid;
		params.introduction = this.state.privacy.introduction;
		params.education = this.state.privacy.education;
		params.experience = this.state.privacy.experience;
		params.honor = this.state.privacy.honor;
		params.gallery = this.state.privacy.gallery;
		params.endorse = this.state.privacy.endorse;
		params.appraise = this.state.privacy.appraise;
		this.props.updatePrivacy(params).then(function (e) {
			if ('response' in e){
				that.props.setPrivacy(e.response);
			}
		});
		this.props.handleLightBoxOpen('');
	}
	handleLightBoxCancel(){
		this.props.handleLightBoxOpen('');
		this.props.reloadPrivacy();
	}

	getOption(title){
		return {
			submit: {
				text: '儲存', //button text
				action: this.handleLightBoxSubmit.bind(this) //buttun action
			},
			cancel: {
				text: '取消',
				action: this.handleLightBoxCancel.bind(this)
			},
			closeIcon: true,  //有無close ICON,
			contentHeight: '600px', //決定content區塊有無最小高度，有設定的話會出現scroll bar
			title: title //標題
		}
	}
	handleChange(type){
		this.state.privacy[type] = this.state.privacy[type] ? 0 : 1;
		this.setState(this.state);
	}
	render() {
		return (
				<LightBox option={this.getOption('讓貴人看見你，這樣設定就對了！')} onClose={this.handleLightBoxCancel.bind(this)} >
					<div styleName="lightWidth">
						<p>
							您目前設定為「關閉」，建議調整為「開啟」
						</p>
						<dl styleName="set">
							{
								this.props.privacy.introduction === 0 &&
								<div>
									<dt>個人摘要</dt>
									<dd>
										<SwtichButton
											onChange={ this.handleChange.bind(this,'introduction') }
											name="introduction"
											checked={this.state.privacy.introduction===1?'checked':''}
											defaultChecked={this.state.privacy.introduction===1?'checked':''}  />
									</dd>
								</div>
							}
							{
								this.props.privacy.experience === 0 &&
								<div>
									<dt>經歷</dt>
										<dd>
										<SwtichButton
											onChange={ this.handleChange.bind(this,'experience') }
											name="experience"
											checked={this.state.privacy.experience===1?'checked':''}
											defaultChecked={this.state.privacy.experience===1?'checked':''}  />
										</dd>
								</div>
							}
							{
								this.props.privacy.education === 0 &&
								<div>
									<dt>學歷</dt>
									<dd>

										<SwtichButton
											onChange={ this.handleChange.bind(this,'education') }
											name="education"
											checked={this.state.privacy.education===1?'checked':''}
											defaultChecked={this.state.privacy.education===1?'checked':''}  />

									</dd>
								</div>
							}
							{
								this.props.privacy.honor === 0 &&
								<div>
									<dt>職涯成就</dt>
									<dd>

										<SwtichButton
											onChange={ this.handleChange.bind(this,'honor') }
											name="honor"
											checked={this.state.privacy.honor===1?'checked':''}
											defaultChecked={this.state.privacy.honor===1?'checked':''}  />

									</dd>
								</div>
							}
							{
								this.props.privacy.gallery === 0 &&
								<div>
									<dt>展示櫥窗</dt>
									<dd>

										<SwtichButton
											onChange={ this.handleChange.bind(this,'gallery') }
											name="gallery"
											checked={this.state.privacy.gallery===1?'checked':''}
											defaultChecked={this.state.privacy.gallery===1?'checked':''}  />

									</dd>
								</div>
							}
							{
								this.props.privacy.endorse === 0 &&
								<div>
									<dt>專長特質與證照</dt>
									<dd>

										<SwtichButton
											onChange={ this.handleChange.bind(this,'endorse') }
											name="mutualFriend"
											checked={this.state.privacy.endorse===1?'checked':''}
											defaultChecked={this.state.privacy.endorse===1?'checked':''}  />

									</dd>
								</div>
							}
							{
								this.props.privacy.appraise === 0 &&
								<div>
									<dt>我的讚美</dt>
									<dd>

										<SwtichButton
											onChange={ this.handleChange.bind(this,'appraise') }
											name="appraise"
											checked={this.state.privacy.appraise===1?'appraise':''}
											defaultChecked={this.state.privacy.appraise===1?'checked':''}  />

									</dd>
								</div>
							}
						</dl>
					</div>
				</LightBox>
		);
	}
}


function mapStateToProps( state, props ) {
	return {
		user: state.user,
		privacy: state.privacy
	};
}

const ChanceCss = CSSModules( ChanceLightBox, css, { allowMultiple: true }  )
const ChanceTranslate = translate( [] )( ChanceCss );

export default connect( mapStateToProps, { queryPrivacyInfo, setPrivacy, updatePrivacy } )( ChanceTranslate );
