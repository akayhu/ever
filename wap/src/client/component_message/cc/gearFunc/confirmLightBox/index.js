import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';

// components
import { LightBox } from 'c_wap_module';

const ConfirmLightBox = ({
	show,
	text,
	handleCancel,
	handleSubmit
}) => {
	if (!show)
		return null;
	return (
		<LightBox
			option={ {closeIcon: true} }
			onClose={ handleCancel }
		>
			<div styleName="gear_lb_content">
				{ text }
				<button
					className="ui primary button"
					styleName="gear_button_left"
					onClick={ handleSubmit }
				>
					確定
				</button>
				<button
					className="ui normal button"
					onClick={ handleCancel }
				>
					取消
				</button>
			</div>
		</LightBox>
	);
};

ConfirmLightBox.propTypes = {
	show: PropTypes.bool.isRequired,
	text: PropTypes.object,
	handleCancel: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired
};

export default compose(
	//translate([]),
	[CSSModules, '_', css]
)(ConfirmLightBox);
