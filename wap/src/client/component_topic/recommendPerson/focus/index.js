import { connect } from 'react-redux';
import React from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

// selectors
import {getBlockLoading} from 'src/client/reducers/topic/selectors';
// components
import Title from 'src/client/component_topic/title/title';
import FocusList from './focusList';
import LoadingBlock from 'src/client/component_common/loadingBlock';
import More from 'src/client/component_topic/more';

const Focus = ({topic, followedList, loading, isLogin}) => {
	if (loading) {
		return <LoadingBlock show height={ 310 } />;
	}
	if (!followedList.length) {
		return null;
	}
	return (
		<div styleName="focusMain">
			<Title mainTitle={ `大家都在關注的${topic}者` } />
			<ul>
				{followedList.slice(0, 5).map((item, index) => (
					<FocusList
						key={ index }
						{ ...item }
					/>
				))}
			</ul>
			{(isLogin && followedList.length > 5) &&
				<More text="看更多" linkUrl="/topic/followed/staffList" />
			}
		</div>
	);
};


function mapStateToProps(state) {
	return {
		isLogin: state.user.isLogin,
		loading: getBlockLoading(state, 'followed'),
	};
}

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css]
)(Focus);
