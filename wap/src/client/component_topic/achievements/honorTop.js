import React from 'react';
import CSSModules from 'react-css-modules';
import {withRouter} from 'react-router';
import compose from 'src/util/compose';
import css from './index.css';
// components
import {NameCard} from 'src/client/component_common/card';
import Image from 'src/client/component_common/image';
import ChangeCard from 'src/client/component_common/changeCard';

function toProfilePage(router, pid) {
	return () => {
		router.push({
			pathname: `/profile/${pid}`,
			state: { anchorTo: 'honor' }
		});
	}
}

const HonorTop = ({data, router}) =>
	<div styleName="honorTop">
		<div styleName="topImg">
			<div styleName="bg" />
			<Image
				domain="profile"
				type="cover"
				src={ data.nameCardInfo.coverWebUrl }
			/>
			<div styleName="userMain">
				<a styleName="userImg" href="#">
					<img src={ data.nameCardInfo.avatarWebUrl } />
				</a>
				<div styleName="userInfo">
					<a styleName="userName" href={ `profile/${data.nameCardInfo.pid}` }>{ data.nameCardInfo.userName }</a>
					<p>{ data.nameCardInfo.companyName }</p>
					<p>{ data.nameCardInfo.jobTitle }</p>
				</div>
				<ChangeCard
					targetPid={ data.nameCardInfo.pid }
					connectionStatus={ data.nameCardInfo.connectionStatus }
					reversible
					primary
				/>
			</div>
		</div>
		<div styleName="topMsg" onClick={ toProfilePage(router, data.nameCardInfo.pid) }>
			{data.tagList.map((tag, index) => (
				<div key={ index } styleName="tag">
					{tag}
				</div>
			))}
			<div styleName="title">{data.title}</div>
			{data.relation ?
				<div styleName="jobName">{ `${data.relation.jobTitle} / ${data.relation.companyName}`}</div> :
				null
			}
			<div styleName="viewAll">
				{`${data.startYear}.${data.startMonth} - ${data.endYear}.${data.endMonth}`}
			</div>
			<p styleName="content">{data.description}</p>
			<div styleName="more"><a href="#">看詳細</a></div>
		</div>
	</div>;

export default compose(
	withRouter,
	[CSSModules, '_', css],
)(HonorTop);
