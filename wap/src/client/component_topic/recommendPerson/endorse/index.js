import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// selectors
import { getBlockLoading } from 'src/client/reducers/topic/selectors';
// components
import EndorseList from './endorseList';
import Title from 'src/client/component_topic/title/title';
import DonutPieChart from 'src/client/component_topic/donutPieChart';
import LoadingBlock from 'src/client/component_common/loadingBlock';

const Endorse = ({topic, endorseData, loading}) => {
	const dataKeys = Object.keys(endorseData);
	if (loading) {
		return <LoadingBlock show height={ 380 } />;
	}
	if (!dataKeys.length) {
		return null;
	}
	return (
		<div styleName="endorseMain">
			<Title mainTitle={ `${topic}者通常會獲得這些肯定` } />
			<ul>
				{dataKeys.map((item, index) =>
					<li key={ index }>
						{/*<DonutPieChart
							index={ index }
							endorsePer={ endorseData[item].count * 100 }
						/>*/}
						<div
							styleName="endorseTit"
							className="h4"
						>
							{ endorseData[item].title }
							<span>TOP3</span>
						</div>
						<EndorseList
							subkey={ endorseData[item].title }
							dataIds={ endorseData[item].ids }
						/>
					</li>
			)}
			</ul>
		</div>
	);
};

Endorse.propTypes = {
	topic: PropTypes.string.isRequired,
	endorseData: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		loading: getBlockLoading(state, 'initialEndorse')
	};
}

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css]
)(Endorse);
