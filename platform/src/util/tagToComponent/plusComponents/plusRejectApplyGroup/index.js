import React from 'react';
import CSSModules from 'react-css-modules';
import {Link} from 'react-router';
import css from './index.css';

const PlusRejectApplyGroup = ({groupid, content, subComponents, _followed}) => {
	return(
		<div styleName="plus_rejectapplygroup">
			<Link to={
				{
					pathname: '/group/applyform', 
					state: {
						channelId: groupid,
						step: 'step3'
					}
				} 
			}>
				{content}
			</Link>
			{subComponents}
			<span>{_followed}</span>
		</div>
	);
}

export default CSSModules(PlusRejectApplyGroup, css);
