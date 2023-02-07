import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import CompanyItem from './companyItem';

const CompanyList = ({compList}) => (
	<div styleName="list_wrap">
		{compList.map((company, index) => (
			<CompanyItem
				key={ index }
				companyName={ company.custName }
				logo={ company.logo }
			/>
			))}
	</div>
	);

export default CSSModules(CompanyList, css);
