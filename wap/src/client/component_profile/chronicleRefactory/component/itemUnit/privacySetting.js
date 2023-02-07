import React from 'react';
import CSSModules from 'react-css-modules';
import css from './unit.css';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';


const PrivacySetting = ({ tempData, changePrivacySetting }) =>
	<DropdownMenu>
		<DropdownTarget>
			<i styleName="itemSetting" className={ this.state.view.privacySettingIcon } />
		</DropdownTarget>
		<DropdownList>
			{
				!tempData &&
				<ul className="dropdown">
					<li onClick={ changePrivacySetting(1) }><i className="world icon" /> 公開	</li>
					<li onClick={ changePrivacySetting(0) }><i className="lock icon" /> 只限本人 </li>
				</ul>
			}
			{
				tempData &&
				<ul className="dropdown">
					<li styleName="tempHint">資訊填寫不完整<br />公開預設只限本人</li>
				</ul>
			}
		</DropdownList>
	</DropdownMenu>;

export default CSSModules(PrivacySetting, css, { allowMultiple: true });
