import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { LightBox } from 'c_wap_module';
import { alertCheckEffectLightbox } from 'src/client/actions/chronicle';
import { updateSinglePrivacyByHint } from 'src/client/actions/privacy';

class HintBox extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const chroniclePrivacySettingName = translateEventName(this.props.chronicle.hintLightbox);
		const lightboxObtion = {
			closeIcon: true,
			title: `是否開啟${chroniclePrivacySettingName}區塊`
		};
		const hoverHnit = `若有「只限本人」的${chroniclePrivacySettingName}資料，並不會因為「開啟」${chroniclePrivacySettingName}區塊而被強制公開。其他會員將只會看到你設定為「公開」的${chroniclePrivacySettingName}`;
		return (
			<LightBox
				option={ lightboxObtion }
				clickOverlayToClose={ true }
				onClose={ () => this.props.alertCheckEffectLightbox('none') } >

				<h3 title={ hoverHnit }>此筆{ chroniclePrivacySettingName }的隱私為[公開]，是否要在更新個人資料同時一併將學歷區塊設定為[開啟]？</h3>
				<div>
					<button className="ui button" onClick={ () => this.props.alertCheckEffectLightbox('none') } >維持現狀</button>
					<button className="ui primary button" onClick={ ()=> this.props.updateSinglePrivacyByHint() }>開啟{ chroniclePrivacySettingName }區塊</button>
				</div>

			</LightBox>
		);
	}
}

const translateEventName = (name) => {
	switch (name) {
		case 'experience':
			return '經歷';
		case 'education':
			return '學歷';
		case 'honor':
			return '成就';
		default:
			return name;
	}
};

HintBox.propTypes = {
	chronicle: PropTypes.object.isRequired
};

HintBox.defaultProps = {
};

const action = { alertCheckEffectLightbox, updateSinglePrivacyByHint };

export default compose(
	connect(null, action),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(HintBox);
