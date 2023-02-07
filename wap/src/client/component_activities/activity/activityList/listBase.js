import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import ListItem from './listItem';
import ActivityLightbox from 'src/client/component_activities/module/Lightbox';
import { getLightBoxActivity } from 'src/client/reducers/activity/selectors';

class ListBase extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="container">
				<LazyLoading body loadingAct={ this.props.loadMore }>
					<div>
						{
							this.props.dataList.map(item =>
								<ListItem
									key={ `listItem-${item.aid}` }
									itemData={ item }
									user={this.props.user}
									author={ this.props.interactionLock ? false : item.editable }
									pageName={this.props.pageName}
									filterName={this.props.filterName}
									tabName={this.props.activeTab}
									handleInteractionLock={this.props.handleInteractionLock}
								/>
							)
						}
						{
							this.props.loading &&
							<div style={ {width: '100%', height: '25px', marginTop: '15px'} }>
								<div className="ui loading" />
							</div>
						}
					</div>
				</LazyLoading>
				{
					this.props.lbActivity &&
					<ActivityLightbox
						itemData={ this.props.lbActivity }
						index={ 0 }
						author={ this.props.lbActivity.editable }
						pageName={this.props.pageName}
						filterName={this.props.filterName}
					/>
				}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		//user: state.user,
		lbActivity: getLightBoxActivity(state.activity)
	};
}

ListBase.propTypes = {
	dataList: PropTypes.array.isRequired,
	loadMore: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	// 預覽模式需要的值
	interactionLock: PropTypes.number,
	handleInteractionLock: PropTypes.func
};

export default compose(
	connect(mapStateToProps),
	[CSSModules, '_', css]
)(ListBase);
