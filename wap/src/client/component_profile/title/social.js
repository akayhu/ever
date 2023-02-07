import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './style.css';
import { loadDataCenter } from 'src/client/actions/privacy';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
// import { Link } from 'react-router';
import compose from 'src/util/compose';

// 最近的文章
class SocialComponentTitle extends React.Component {
	constructor(props) {
		super(props);
	}
	onSelected(index) {
		this.props.loadDataCenter(
			'updateSinglePrivacy',
			{
				privacy: this.props.privacyText,
				privacySetting: index
			}
		);
	}
	render() {
		return (
			<div styleName="title">
				<div>
					<span className="h2">{ this.props.maintitle }</span>
					{ this.props.privacySettingSwitch &&
						<DropdownMenu>
							<DropdownTarget>
								<i className={ privacySettingIcon(this.props.privacy) } />
							</DropdownTarget>
							<div className="dropdownList">
								<DropdownList>
									<ul className="dropdown">
										<li onClick={ this.onSelected.bind(this, 1) } data-gtm-profile-social={ `${this.props.gtmTitleName} - 公開` }>
											<i className="world icon" aria-hidden="true" /> 公開
										</li>
										{
											this.props.advancenSetting &&
											<li onClick={ this.onSelected.bind(this, 2) } data-gtm-profile-social={ `${this.props.gtmTitleName} - 朋友` }>
												<i className="friends icon" aria-hidden="true" /> 朋友
											</li>
										}
										<li onClick={ this.onSelected.bind(this, 0) } data-gtm-profile-social={ `${this.props.gtmTitleName} - 只限本人` }>
											<i className="lock icon" aria-hidden="true" /> 只限本人
										</li>
									</ul>
								</DropdownList>
							</div>
						</DropdownMenu>
					}
				</div>
				{ this.props.children }
			</div>
		);
	}
}

SocialComponentTitle.defaultProps = {
	privacySettingSwitch: false,
	advancenSetting: false,
	privacy: 0,
};
SocialComponentTitle.propTypes = {
	privacySettingSwitch: PropTypes.bool,
	advancenSetting: PropTypes.bool,
	maintitle: PropTypes.string.isRequired,
	privacyText: PropTypes.string,
	privacy: PropTypes.number,
};

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

export default compose(
	connect(null, { loadDataCenter }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SocialComponentTitle);
