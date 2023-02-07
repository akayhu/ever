import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';
// selectors
import { getDataByIdsAndKey } from 'src/client/reducers/topic/selectors';
// components
import SubscribePeople from 'src/client/component_common/subscribePeople';
import {NameCard} from 'src/client/component_common/card';
import More from 'src/client/component_topic/more';

const RelatedList = ({relatedList, subkey, isLogin}) => {
	if (!relatedList.length) {
		return null;
	}
	return (
		<div>
			<div styleName="socialListTitle">{ subkey }</div>
			<div styleName="sociaItemlList">
				{relatedList.slice(0, 3).map((obj, index) =>
					<div styleName="sociaItem" key={ index }>
						<div styleName="socialAvatar">
							<NameCard
								targetPid={ obj.pid }
								href={ `profile/${obj.pid}` }
								imgSrc={ obj.avatarWebUrl }
								name={ obj.userName }
							/>
						</div>
						<div styleName="socialInfo">
							<NameCard
								targetPid={ obj.pid }
								href={ `profile/${obj.pid}` }
								imgSrc={ obj.avatarWebUrl }
								name={ obj.userName }
								textMode
							/>
							<p>{obj.jobTitle}</p>
						</div>
						<div styleName="socialSubscribe">
							<SubscribePeople
								targetPid={ obj.pid }
								subscribeStatus={ obj.subscribeStatus }
								notificationStatus={ obj.notificationStatus }
								fullModeButton={ false }
								alwaysShow
								reversible
								line
							/>
						</div>
					</div>
				)}
				{(isLogin && relatedList.length > 3) &&
					<More text="看更多" linkUrl={ `/topic/${subkey}` } />
				}
			</div>
		</div>
	);
};

function mapStateToProps(state, {dataIds, subkey}) {
	return {
		isLogin: state.user.isLogin,
		relatedList: getDataByIdsAndKey(state, dataIds, 'related', subkey),
	};
}

export default compose(
	connect(mapStateToProps),
	translate([]),
	[CSSModules, '_', css]
)(RelatedList);
