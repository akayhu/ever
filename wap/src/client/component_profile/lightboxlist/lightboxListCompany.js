import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import Image from 'src/client/component_common/image';

const LightboxListCompany = ({ href, logoUrl, custName}) =>
	<div styleName="item">
		<a href={ href } styleName="pro_link">
			<Image type={ 'company' }	title={ custName } data-gtm-profile-social="誰看過我 - logo" src={ logoUrl }	/>
		</a>
		<div styleName="pro_content">
			<a href={ href }>{ custName }</a>
		</div>
	</div>;

export default CSSModules(LightboxListCompany, css, { allowMultiple: true });
