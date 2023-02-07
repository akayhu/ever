import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import clientConfig from 'src/configs/client';

const CompanyItem = ({companyName, logo}) => (
	<div styleName="item_wrap">
		<div styleName="company_name">{companyName}</div>
		{
			logo && 
			<img styleName="logo" src={ `${clientConfig.params.companyLogo}${logo}` } alt="company_img"/>
		}
	</div>
);

export default CSSModules(CompanyItem, css);
