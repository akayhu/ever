import React from 'react';
import CSSModules from 'react-css-modules';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import css from './index.css';

const PrivacySetting = ({ privacySetting, setPrivacy }) =>
	<div styleName="privacySetting">
		<i className={ privacySettingIconDefault(privacySetting) } />{ privacySettingTextDefault(privacySetting) }
		<DropdownMenu>
			<DropdownTarget>
				<i className="dropdown icon" />
			</DropdownTarget>
			<DropdownList>
				<ul className="dropdown">
					<li onClick={ () => setPrivacy(0) }><i className="world icon" />公開</li>
					<li onClick={ () => setPrivacy(1) }><i className="friends icon" />朋友</li>
					<li onClick={ () => setPrivacy(2) }><i className="lock icon" />只限本人</li>
				</ul>
			</DropdownList>
		</DropdownMenu>
	</div>;

function privacySettingIconDefault(setting) {
	switch (setting) {
		case 0:
			return 'world icon';
		case 1:
			return 'friends icon';
		case 2:
			return 'lock icon';
		default:
			return 'world icon';
	}
}

function privacySettingTextDefault(setting) {
	switch (setting) {
		case 0:
			return '公開';
		case 1:
			return '朋友';
		case 2:
			return '只限本人';
		default:
			return '公開';
	}
}

export default CSSModules(PrivacySetting, css, { allowMultiple: true });
