import React from 'react';
import { connect } from 'react-redux';
// components
import Headline from '../title/headline';
import Focus from './focus';
import Endorse from './endorse';
import Related from './related';
// utils
import { memorizeLast } from 'src/util/tools';
// selectors
import { getFunc, getInfoByKey, getDataByIdsAndKey, getNestedDataByKey } from 'src/client/reducers/topic/selectors';

const RecommendPerson = ({ topic, followedList, endorseData, relatedData }) => {
	const showTitle = followedList.length || Object.keys(endorseData).length || Object.keys(relatedData).length;
	return (
		<div id="screens">
			{ showTitle >= 0 && <Headline headline="你可能想認識的人" /> }
			<Focus topic={ topic } followedList={ followedList } />
			<Endorse topic={ topic } endorseData={ endorseData } />
			<Related topic={ topic } relatedData={ relatedData } />
		</div>
	);
};


const memoizeDataSelector = memorizeLast(getDataByIdsAndKey, [2]);

function mapStateToProps(state) {
	const followedIds = getInfoByKey(state, 'followed')('ids');
	return {
		topic: getFunc(state),
		followedList: memoizeDataSelector(state, followedIds, 'followed'),
		endorseData: getNestedDataByKey(state, 'endorse'),
		relatedData: getNestedDataByKey(state, 'related')
	};
}
export default connect(mapStateToProps)(RecommendPerson);
