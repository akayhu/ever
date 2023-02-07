import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { activityLightboxOpen } from 'src/client/actions/activity';
// components
import {NameCard} from 'src/client/component_common/card';
import Image from 'src/client/component_common/image';

const WorksList = ({data, activityLightboxOpen, from}) =>
	<ul styleName="worksMain">
		{data.map((item, index) =>
			<li
				key={ index }
				styleName="activityBlock"
				onClick={ () => { activityLightboxOpen(item); } }
				style={ from === 'staffList' ? { width: '350px', marginBottom: '13px', marginRight:'8px' } : null }
			>
				<div styleName="worksImg" style={ from === 'staffList' ? { height: '180px' } : null }>
					<Image
						type={ 'topic' }
						domain={ 'gallery' }
						src={ item.extraInfo.attachmentList[0] && item.extraInfo.attachmentList[0].activityFileUrl }
					/>
				</div>
				<div styleName="worksContent">
					<div styleName="worksTit">{ item.title }</div>
					<div styleName="userMain">
						<NameCard
							targetPid={ item.userInfo.pid }
							href={ `/profile/${item.userInfo.pid}` }
							imgSrc={ item.userInfo.userFileUrl }
							name={ item.userInfo.userName }
						/>
						<div styleName="userInfo">
							<NameCard
								targetPid={ item.userInfo.pid }
								href={ `/profile/${item.userInfo.pid}` }
								imgSrc={ item.userInfo.userFileUrl }
								name={ item.userInfo.userName }
								textMode
							/>
							<p styleName="userContent">{ item.userInfo.userCompany }</p>
							<p styleName="userContent">{ item.userJobTitle }</p>
						</div>
					</div>
				</div>
			</li>
		)}
	</ul>;

WorksList.propTypes = {
	data: PropTypes.array
};

export default compose(
	connect(null, {activityLightboxOpen}),
	[CSSModules, '_', css]
)(WorksList);
