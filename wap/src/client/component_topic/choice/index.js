import React from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import {memorizeLast} from 'src/util/tools';
// selectors
import {getInfoByKey, getDataByIdsAndKey, getBlockLoading} from 'src/client/reducers/topic/selectors';
// components
import LoadingBlock from 'src/client/component_common/loadingBlock';
import More from 'src/client/component_topic/more';
import ChoiceList from './choiceList';
import ChoiceTop from './choiceTop';

const Choice = ({hotsList, loading, isLogin, userPid, topicNow}) => {
	if (loading) {
		return <LoadingBlock show height={ 300 } />;
	}

	if (!hotsList.length) return null;

	const firstFive = hotsList.slice(0, 5);
	const length = firstFive.length;
	const [first, ...rest] = firstFive;
	return (
		<div>
			{(length === 1 || length === 5) &&
				<ChoiceTop topicNow={topicNow} userId={userPid} data={ first } />
			}
			{length !== 1 &&
				<ChoiceList topicNow={topicNow}  userId={userPid} listData={ length < 5 ? firstFive : rest } />
			}
			{(isLogin && hotsList.length > 5) && <More text="看更多職場動態" linkUrl="/topic/hot/articleList" />}
		</div>
	);
};

const memoizeDataSelector = memorizeLast(getDataByIdsAndKey, [2]);

function mapStateToProps(state) {
	const ids = getInfoByKey(state, 'news', 'hots')('ids');

	return {
		isLogin: state.user.isLogin,
		userPid: state.user.pid,
		loading: getBlockLoading(state, 'news'),
		hotsList: memoizeDataSelector(state, ids, 'news', 'hots'),
	};
}

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Choice);
