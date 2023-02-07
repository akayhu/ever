import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './style.css';
// action
// import { setPrivacy, updateSinglePrivacy } from 'src/client/actions/privacy';
import { loadDataCenter } from 'src/client/actions/privacy';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import compose from 'src/util/compose';
//
class PersonalInfoComponentTitle extends React.Component {
	constructor(props) {
		super(props);
		this.addBtnClick = () => this.props.addBtnClick();
		this.ontopBtnClick = () => this.props.ontopBtnClick();
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
		const { showPrivacySetting, viewas, gtmTopValue, gtmValue } = this.props;
		return (
			<div styleName="personal" style={ { textAlign: this.props.textAlign } }>
				<h1 styleName="text">
					{this.props.maintitle}
					{/* {(showPrivacySetting && viewas === 'self') &&
						<div styleName="privacy_drop">
							<DropdownMenu>
								<DropdownTarget>
									<i className={ privacySettingIcon(this.props.privacy) } />
								</DropdownTarget>
								<div className="dropdownList">
									<DropdownList>
										<ul className="dropdown">
											<li onClick={ this.onSelected.bind(this, 1) } data-gtm-profile={ `${this.props.gtmTitleName} - 公開` }>
												<i className="world icon" aria-hidden="true" /> 公開
											</li>
											<li onClick={ this.onSelected.bind(this, 0) } data-gtm-profile={ `${this.props.gtmTitleName} - 只限本人` }>
												<i className="lock alternate icon" aria-hidden="true" /> 只限本人
											</li>
										</ul>
									</DropdownList>
								</div>
							</DropdownMenu>
						</div>
					} */}
				</h1>
				{/* <div styleName="buttonBlock">
					{
						this.props.ontopButtonLoading &&
						<span className="ui loading" />
					}
					{
						this.props.ontopButton &&
						<button
							className="mini ui primary button"
							styleName="btn"
							onClick={ this.ontopBtnClick }
							data-gtm-profile={ gtmTopValue }
						>置頂</button>
					}
					{
						this.props.createButton &&
						<button
							className="mini ui primary button"
							styleName="btn"
							onClick={ this.addBtnClick }
							data-gtm-profile={ gtmValue }
						>新增</button>
					}
				</div> */}
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

PersonalInfoComponentTitle.propTypes = {
	showPrivacySetting: PropTypes.bool,
	viewas: PropTypes.string,
	privacy: PropTypes.number,
	privacyText: PropTypes.string,
	maintitle: PropTypes.string,
	ontopButton: PropTypes.bool,
	createButton: PropTypes.bool,
	textAlign: PropTypes.string,
	ontopBtnClick: PropTypes.func,
	addBtnClick: PropTypes.func
};

PersonalInfoComponentTitle.defaultProps = {
	createButton: false,
	ontopButton: false,
	showPrivacySetting: false,
	textAlign: 'center'
};

export default compose(
	connect(null, { loadDataCenter }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(PersonalInfoComponentTitle);
