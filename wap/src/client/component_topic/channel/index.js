import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { remove } from 'lodash/array';
// utils
import {memorizeLast} from 'src/util/tools';
// selectors
import {getFunc, getInfoByKey, getDataByIdsAndKey, getBlockLoading} from 'src/client/reducers/topic/selectors';
// components
import More from 'src/client/component_topic/more';
import Headline from '../title/headline';
import BlockCard from '../blockCard' ;
import LoadingBlock from 'src/client/component_common/loadingBlock';
import BotList from './botList';

import { setDirectPanel } from 'src/client/actions/alert';

class Channel extends Component {
	constructor(props) {
		super(props);
		this.checkLogin = this.checkLogin.bind(this);
	}

	checkLogin(checkLoginCallback) {
		const { isLogin } = this.props;
		if(!isLogin) this.props.setDirectPanel(true);
		else checkLoginCallback();
	}

	render() {
		const {topic, channelList, loading, isLogin} = this.props;
		if (loading) {
			return <LoadingBlock show height={ 300 } />;
		}

		if (!channelList.length) return null;
		// 將第一筆提出 first這個key是在utils getIdsAndByIds的時候塞進去
		const first = (remove(channelList, (item) => {
			return item.first === true;
		}))[0];
		const twoFour = channelList.slice(0, 3);
		const length = twoFour.length + 1;
		const btnPropInfo = {
			channelId: first.id,
			subscribe: first.subscribe,
			isLogin,
			isAdmin: first.isAdmin,
			isEditor: first.isEditor
		};

		return (
			<div>
				<Headline headline={ `最多${topic}者加入的頻道` } />
				{(length === 1 || length === 4) &&
					<BlockCard
						id={ first.id }
						domain="channel"
						blockBg={ first.coverWebUrl }
						blockTit={ first.name }
						blockMaster={ first.avatarWebUrl }
						blockView={ first.subscribeCount }
						blockMemberInfo={ first.subscriberList }
						joinName="此頻道"
						activityList={ first.activityList || [] }
						btnPropInfo={ btnPropInfo }
						checkLogin={ this.checkLogin }
					/>
				}
				{length !== 1 &&
					<BotList listData={ length < 4 ? first.concat(twoFour) : twoFour } checkLogin={ this.checkLogin } />
				}
				{(isLogin && channelList > 4) &&
					<More text="看更多頻道" linkUrl="/channel" />
				}
			</div>
		);
	}
}

const memoizeDataSelector = memorizeLast(getDataByIdsAndKey, [2]);

function mapStateToProps(state) {
	const channelIds = getInfoByKey(state, 'channel')('ids');
	return {
		topic: getFunc(state),
		isLogin: state.user.isLogin,
		loading: getBlockLoading(state, 'channel'),
		channelList: memoizeDataSelector(state, channelIds, 'channel')
	};
}

export default compose(
	connect(mapStateToProps, { setDirectPanel }),
	[CSSModules, '_', css]
)(Channel);
