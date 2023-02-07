import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { Link } from 'react-router';

const PlusApplyNotificationGroup = ({groupid, content, subComponents, _followed}) => {

	return(
		<div styleName="plus_plusApplyNotificationGroup">
			<a href={`/group/${groupid}/management?mode=membersJoin`}>
				點此審核社團
			</a>

			<span styleName="content_text">{content}</span>
			{subComponents}
			{_followed}
		</div>
	);
}
	

export default CSSModules(PlusApplyNotificationGroup, css);
