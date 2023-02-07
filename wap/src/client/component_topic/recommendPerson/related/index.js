import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// selectors
import {getBlockLoading} from 'src/client/reducers/topic/selectors';
// components
import RelatedList from './relatedList';
import Title from 'src/client/component_topic/title/title';
import LoadingBlock from 'src/client/component_common/loadingBlock';

const Related = ({topic, relatedData, loading}) => {
	const dataKeys = Object.keys(relatedData);
	if (loading) {
		return <LoadingBlock show height={ 390 } />;
	}
	if (!dataKeys.length) {
		return null;
	}
	return (
		<div styleName="socialMain">
			<Title mainTitle={ `跟${topic}工作相關的人`} />
			{
				dataKeys.map((item, index) => {
					return relatedData[item].ids.length > 0 ? (
						<div key={ index } styleName="socialList">
							<RelatedList
								subkey={ relatedData[item].title }
								dataIds={ relatedData[item].ids }
							/>
						</div>
					): null;
				})
			}
		</div>
	);
};

function mapStateToProps(state) {
	return {
		loading: getBlockLoading(state, 'initialRelated')
	};
}

Related.propTypes = {
	topic: PropTypes.string.isRequired,
	relatedData: PropTypes.object.isRequired
};

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css]
)(Related);
