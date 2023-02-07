import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './lightBox.css';
import SwtichButton from 'src/client/component_common/switchButton';
import { LightBox, DropList} from 'c_wap_module';
import { setPrivacy, updatePrivacy } from 'src/client/actions/privacy';



class ContactsLightBox extends Component {
	constructor(props){
		super(props);
		this.state = {
			privacySettingData: [
				{ label: '只限本人', value: 0, iconFont: 'lock icon'},
				{ label: '公開', value: 1, iconFont: 'world icon'},
				{ label: '朋友', value: 2, iconFont: 'friends icon'},
			]
		};
		this.state.privacy = {};
		this.state.privacy.introduction = this.state.privacy.introduction;
		this.state.privacy.education = this.state.privacy.education;
		this.state.privacy.experience = this.state.privacy.experience;
		this.state.privacy.gallery = this.state.privacy.gallery;
		this.state.privacy.recentActivity = this.state.privacy.recentActivity;
		this.state.privacy.collectActivity = this.state.privacy.collectActivity;
		this.state.privacy.mutualFriend = this.state.privacy.mutualFriend;
		this.state.privacy.group = this.state.privacy.group;
		this.state.privacy.subscribe = this.state.privacy.subscribe;
		this.state.privacy.collectActivity = this.state.privacy.collectActivity;
	}
	handleLightBoxSubmit(){
		let that = this;
		let params = {};//this.state.privacy;
		params.pid = this.props.privacy.pid;
		params.introduction = this.state.privacy.introduction;
		params.education = this.state.privacy.education;
		params.experience = this.state.privacy.experience;
		params.gallery = this.state.privacy.gallery;
		params.recentActivity = this.state.privacy.recentActivity;
		params.collectActivity = this.state.privacy.collectActivity;
		params.mutualFriend = this.state.privacy.mutualFriend;
		params.group = this.state.privacy.group;
		params.subscribe = this.state.privacy.subscribe;
		params.collectActivity = this.state.privacy.collectActivity;
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

	onSelected(object,value) {
		switch (object,value.value){
			case 0:
				this.state.privacy[object] = 0;
				value.label = '只限本人';
				value.value = 0;
				value.iconFont = 'lock icon';
				break;
			case 1:
				this.state.privacy[object] = 1;
				value.label = '公開';
				value.value = 1;
				value.iconFont = 'world icon';
				break;
			case 2:
				this.state.privacy[object] = 2;
				value.label = '朋友';
				value.value = 2;
				value.iconFont = 'friends icon';
				break;
		}
		this.setState(this.state);
	}

	handleChange(type){
		this.state.privacy[type] = this.state.privacy[type] ? 0 : 1;
		this.setState(this.state);
	}
	render() {
		return (
			<LightBox option={this.getOption('立即迅速拓展人脈，這樣設定就對了！')} onClose={this.handleLightBoxCancel.bind(this)} >
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
							this.props.privacy.recentActivity === 0 &&
							<div>
								<dt>最新的文章</dt>
								<dd>
									<SwtichButton
										onChange={ this.handleChange.bind(this,'recentActivity') }
										name="recentActivity"
										checked={this.state.privacy.recentActivity===1?'checked':''}
										defaultChecked={this.state.privacy.recentActivity===1?'checked':''}  />
								</dd>
							</div>
						}
						{
							this.props.privacy.mutualFriend === 0 &&
							<div styleName="friends">
								<dt>我的朋友</dt>
								<dd>
									<DropList
										listContent={ this.state.privacySettingData }
										onSelected={this.onSelected.bind(this, 'mutualFriend')}
										defaultIndex={this.props.privacy.mutualFriend + 1}
										disabled={false}
									/>
								</dd>
							</div>
						}
						{
							this.props.privacy.subscribe === 0 &&
							<div>
								<dt>我的關注</dt>
								<dd>
									<SwtichButton
										onChange={ this.handleChange.bind(this,'subscribe') }
										name="subscribe"
										checked={this.state.privacy.subscribe===1?'checked':''}
										defaultChecked={this.state.privacy.subscribe===1?'checked':''}  />
								</dd>
							</div>
						}
						{
							this.props.privacy.group === 0 &&
							<div>
								<dt>參加的社團</dt>
								<dd>
									<SwtichButton
										onChange={ this.handleChange.bind(this,'group') }
										name="group"
										checked={this.state.privacy.group===1?'checked':''}
										defaultChecked={this.state.privacy.group===1?'checked':''}  />
								</dd>
							</div>
						}
						{
							this.props.privacy.collectActivity === 0 &&
							<div>
								<dt>收藏的文章</dt>
								<dd>
									<SwtichButton
										onChange={ this.handleChange.bind(this,'collectActivity') }
										name="collectActivity"
										checked={this.state.privacy.collectActivity===1?'checked':''}
										defaultChecked={this.state.privacy.collectActivity===1?'checked':''}  />
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

const ContactsCss = CSSModules( ContactsLightBox, css, { allowMultiple: true }  )
const ContactsTranslate = translate( [] )( ContactsCss );

export default connect( mapStateToProps, {  setPrivacy, updatePrivacy } )( ContactsTranslate );
