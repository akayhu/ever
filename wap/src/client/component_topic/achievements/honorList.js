import React from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { withRouter } from 'react-router';
import css from './index.css';
import { NameCard } from 'src/client/component_common/card';
import ChangeCard from 'src/client/component_common/changeCard';

const HonorList = ({ listData, from, router }) => {
	function toProfilePage(pid) {
		return () => {
			router.push({
				pathname: `/profile/${pid}`,
				state: { anchorTo: 'honor' }
			});
		};
	}
	return (
		<ul styleName="honorList">
			{
				listData.map((item, index) => (
					<li key={ index } style={ from === 'staffList' ? { width: '349px' } : null }>
						<div styleName="honorUser">
							<div styleName="userImg">
								<NameCard
									targetPid={ item.pid }
									href={ `/profile/${item.pid}` }
									imgSrc={ item.nameCardInfo.avatarWebUrl }
									name={ item.nameCardInfo.userName }
									textMode={ false }
									avatarSize={ 70 }
								/>
							</div>
							<div styleName="userInfo" style={ from === 'staffList' ? { width: '140px' } : null }>
								<a styleName="userName" href={ `/profile/${item.pid}` }>{ item.nameCardInfo.userName }</a>
								<p styleName="user_exp_top">{ item.nameCardInfo.companyName }</p>
								<p styleName="user_exp_bot">{ item.nameCardInfo.jobTitle }</p>
							</div>
							<ChangeCard
								targetPid={ item.nameCardInfo.pid }
								connectionStatus={ item.nameCardInfo.connectionStatus }
								reversible
								primary
							/>
						</div>
						<div styleName="honor_body" onClick={ toProfilePage(item.pid) }>
							{
								item.tagList.map((tag, index) => (
									<div key={ index } styleName="tag">{ tag }</div>
								))
							}
							<div styleName="title">{ item.title }</div>
							<div styleName="viewAll">
								{ `${item.startYear}.${item.startMonth} - ${item.endYear}.${item.endMonth}` }
							</div>
							{
								item.relation
								? <div styleName="jobName">{ `${item.relation.jobTitle} / ${item.relation.companyName}` }</div>
								: null
							}
							<p styleName="content">
								{ item.description }
							</p>
						</div>
					</li>
				))
			}
		</ul>
	);
};

export default compose(withRouter, [CSSModules, '_', css])(HonorList);
