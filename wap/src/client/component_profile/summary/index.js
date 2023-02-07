import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { DropdownMenu, DropdownTarget, DropdownList, LightBox } from 'c_wap_module';
import SummaryWizard from './wizard';
import SummaryEditForm from './editform';
import { createFromPromotion, onchangeFromPromotion, initialFromPromotion } from 'src/client/actions/global';
import { loadProfile, updateUserIntroduction } from 'src/client/actions/profile';
import { loadDataCenter } from 'src/client/actions/privacy';

import compose from 'src/util/compose';

// 個人簡介

class Summary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultFreekey: '',
			defaultElf: {},
			lightbox: false
		};
		this.handleLightbox = this.handleLightBoxOpen.bind(this);
	}
	updateDefaultFreekey(str) {
		this.state.defaultFreekey = str;
		this.setState({	defaultFreekey: this.state.defaultFreekey	});
	}
	updateDefaultElf(obj) {
		this.state.defaultElf = obj;
		this.setState({	defaultElf: this.state.defaultElf	});
	}
	handleLightBoxOpen(e) {
		e.preventDefault();
		this.setState({lightbox: (this.state.lightbox === false)});
	}
	deleteContent() {
		this.props.updateUserIntroduction({
			pid: this.props.user.pid,
			introduction: '',
			privacySetting: this.props.privacy
		}).then(() => {
			this.props.loadProfile({ pid: this.props.user.pid });
			this.setState({lightbox: false});
		});
	}
	changeEditStatus(promotion) {
		this.props.createFromPromotion({ promotion });
	}
	changePrivacySetting(index) {
		this.props.loadDataCenter(
			'updateSinglePrivacy',
			{
				privacy: 'introduction',
				privacySetting: index
			}
		);
	}
	render() {
		const lightboxOption = {
			submit: {
				text: '確定', // button text
				action: this.deleteContent.bind(this) // buttun action
			},
			cancel: {
				text: '取消',
				action: this.handleLightbox
			},
			closeIcon: true // 有無close ICON
		};

		if( !this.props.profile || !this.props.profile.hasOwnProperty('pid') ) return null;

		return (
			<div>
				{
					this.props.promotion !== 'introduction' &&
					this.props.promotion !== 'wizard' &&
					this.props.profile.completeStatus && this.props.profile.completeStatus.introduction === 1 &&
					<div styleName="summary_main">
						<span className="h2">個人摘要：</span>
						{/* {
							this.props.viewas === 'self' &&
							<span styleName="dropdown_icon_font_size">
								<DropdownMenu>
									<DropdownTarget>
										<i className="edit icon" />
									</DropdownTarget>
									<div className="dropdownList">
										<DropdownList>
											<ul className="dropdown noIcon">
												<li onClick={ () => this.changeEditStatus('introduction') }>編輯</li>
												<li onClick={ this.handleLightbox }>刪除</li>
											</ul>
										</DropdownList>
									</div>
								</DropdownMenu>
								<DropdownMenu>
									<DropdownTarget>
										<i className={ privacySettingIcon(this.props.privacy) } />
									</DropdownTarget>
									<div className="dropdownList">
										<DropdownList>
											<ul className="dropdown">
												<li onClick={ this.changePrivacySetting.bind(this, 1) } data-gtm-profile="摘要隱私 - 公開">
													<i className="world icon" aria-hidden="true" /> 公開
												</li>
												<li onClick={ this.changePrivacySetting.bind(this, 0) } data-gtm-profile="摘要隱私 - 只限本人">
													<i className="lock icon" aria-hidden="true" /> 只限本人
												</li>
											</ul>
										</DropdownList>
									</div>
								</DropdownMenu>
							</span>
						} */}
						<div className="body_text" styleName="profile_summary_content">
							{this.props.profile.introduction}
						</div>
					</div>
				}
				{
					this.props.promotion === 'introduction' && // edit mode
					<div styleName="summary_main">
						<span className="h2">個人摘要：</span>
						<SummaryEditForm
							changeEditStatus={ this.changeEditStatus.bind(this) }
							pid={ this.props.user.pid }
							promotion={ this.props.promotion }
							privacySetting={ this.props.privacy }
							profile={ this.props.profile }
							updateDefaultFreekey={ this.updateDefaultFreekey.bind(this) }
							defaultFreekey={ (this.state.defaultFreekey) ? this.state.defaultFreekey : this.props.profile.introduction }
						/>
					</div>
				}
				{
					this.props.promotion === 'wizard' && // edit mode
					<div styleName="summary_main">
						<SummaryWizard
							changeEditStatus={ this.changeEditStatus.bind(this) }
							pid={ this.props.user.pid }
							privacy={ this.props.privacy }
							updateDefaultElf={ this.updateDefaultElf.bind(this) }
							defaultElf={ this.state.defaultElf }
						/>
					</div>
				}
				{/* {
					this.props.viewas === 'self' &&
					(this.props.profile.completeStatus.introduction === 0 || this.props.profile.completeStatus.introduction === null) &&
					(this.props.promotion !== 'introduction' && this.props.promotion !== 'wizard') &&
					<div styleName="summary_unfilled" onClick={ () => this.changeEditStatus('introduction') }>
						<div data-gtm-profile="區塊新增-個人摘要"><i className="avatar_circle icon" />新增個人摘要，清楚傳達個人價值和想法。</div>
					</div>
				} */}
				{
					this.state.lightbox &&
					<LightBox refs="lightbox" option={ lightboxOption } onClose={ this.handleLightbox }>
						<div styleName="summary_delete_lightbox">確定要刪除個人摘要？</div>
					</LightBox>
				}
			</div>
		);
	}
}

function privacySettingIcon(setting) {
	switch (setting) {
		case 0:
			return 'lock icon';
		case 1:
			return 'world icon';
		case 2:
			return 'friends icon';
		default:
			return 'world icon';
	}
}

Summary.defaultProps = {
	privacy: 0,
};
Summary.propTypes = {
	privacy: PropTypes.number,
};

const action = {
	createFromPromotion,
	onchangeFromPromotion,
	initialFromPromotion,
	updateUserIntroduction,
	loadProfile,
	loadDataCenter,
};

export default compose(
	connect(null, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Summary);
