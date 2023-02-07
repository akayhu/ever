import React, { Component } from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
// utils
import {memorizeLast} from 'src/util/tools';
// selectors
import {getFunc, getInfoByKey, getDataByIdsAndKey, getBlockLoading} from 'src/client/reducers/topic/selectors';

// components
import Headline from '../title/headline';
import css from './index.css';
import Honor from './honor';
import Work from './work';

class Achievements extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {isLogin, topic, galleryList, galleryLoading, honorList, honorLoading} = this.props;
		const hasGallery = galleryList.length > 0;
		const hasHonor = honorList.length > 0;
		return (
			<div>
				{(hasGallery || hasHonor) &&
					<Headline headline={ `${topic}者的成就與作品` } />
				}
				<Work
					isLogin={ isLogin }
					galleryList={ galleryList }
					loading={ galleryLoading }
				/>
				<Honor
					isLogin={ isLogin }
					honorList={ honorList }
					loading={ honorLoading }
				/>
			</div>
		);
	}
}

const memoizeDataSelectorGallery = memorizeLast(getDataByIdsAndKey, [2]);
const memoizeDataSelectorHonor = memorizeLast(getDataByIdsAndKey, [2]);

function mapStateToProps(state) {
	const galleryIds = getInfoByKey(state, 'gallery')('ids');
	const honorIds = getInfoByKey(state, 'honor')('ids');

	return {
		topic: getFunc(state),
		isLogin: state.user.isLogin,
		galleryList: memoizeDataSelectorGallery(state, galleryIds, 'gallery'),
		honorList: memoizeDataSelectorHonor(state, honorIds, 'honor'),
		galleryLoading: getBlockLoading(state, 'gallery'),
		honorLoading: getBlockLoading(state, 'initialHonor'),
	};
}

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css]
)(Achievements);
