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
import LoadingBlock from 'src/client/component_common/loadingBlock';
import More from 'src/client/component_topic/more';
import Headline from '../title/headline';
import BlockCard from '../blockCard';
import BotList from './botList';

import { setDirectPanel } from 'src/client/actions/alert';

class Group extends Component {
	constructor(props) {
		super(props);
		this.checkLogin = this.checkLogin.bind(this);
	}

	checkLogin(checkLoginCallback) {
		const { isLogin } = this.props;
		if (!isLogin) this.props.setDirectPanel(true);
		else checkLoginCallback();
	}

	render() {
		const {topic, groupList, loading, isLogin} = this.props;
		if (loading) {
			return <LoadingBlock show height={ 300 } />;
		}

		if (!groupList.length) return null;
		// 將第一筆提出 first這個key是在utils getIdsAndByIds的時候塞進去
		const first = (remove(groupList, (item) => {
			return item.first === true;
		}))[0];
		const twoFour = groupList.slice(0, 3);
		const length = twoFour.length + 1;
		const btnPropInfo = {
			channelId: first.id,
			isHead: first.isHead,
			isMember: first.isMember,
			isApplying: first.isApplying,
			joinSetting: first.joinSetting,
			noticeStatus: first.noticeStatus,
			isLogin
		};

		return (
			<div>
				<Headline headline={ `最多${topic}人加入的社團` } />
				{(length === 1 || length === 4) &&
					<BlockCard
						id={ first.id }
						domain="group"
						blockBg={ first.coverWebUrl }
						blockTit={ first.name }
						blockMemberInfo={ first.memberInfo }
						//blockMaster={ first.memberInfo[0].avatarWebUrl}
						blockView={ first.memberCount }
						//blockMasterName={ first.memberInfo[0].userName}
						joinName="社團"
						//subscriberList={ first.memberInfo.slice(1)}
						activityList={ first.activityList || [] }
						btnPropInfo={ btnPropInfo }
						checkLogin={ this.checkLogin }
					/>
				}
				{length !== 1 &&
					<BotList listData={ length < 4 ? first.concat(twoFour) : twoFour } checkLogin={ this.checkLogin } />
				}
				{(isLogin && length > 4) &&
					<More text="看更多社團" linkUrl="/group" />
				}
			</div>
		);
	}
}

const memoizeDataSelector = memorizeLast(getDataByIdsAndKey, [2]);

function mapStateToProps(state) {
	const groupIds = getInfoByKey(state, 'group')('ids');
	return {
		topic: getFunc(state),
		isLogin: state.user.isLogin,
		loading: getBlockLoading(state, 'group'),
		groupList: memoizeDataSelector(state, groupIds, 'group')
	};
}

export default compose(
	connect(mapStateToProps, { setDirectPanel }),
	[CSSModules, '_', css]
)(Group);
