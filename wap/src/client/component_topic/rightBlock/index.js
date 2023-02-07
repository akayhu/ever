import React, { Component } from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';

import { HaveCountTemplate } from 'src/client/component_common/contactTemplate';
import LazyLoading from 'src/client/component_common/lazyLoad/list';

import ChangeCard from 'src/client/component_common/changeCard';
import WorksList from 'src/client/component_topic/achievements/worksList';
import HonorList from 'src/client/component_topic/achievements/honorList';

class RightBlock extends Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		const { activeTab, dataList, pid, isLoading } = this.props;
		return (
			<div>
				<LazyLoading body loadingAct={ this.props.loadMore }>
					<div styleName="list_bg">
						{
							(activeTab === 'followed' || activeTab === 'endorse') &&
							dataList.length ?
							dataList.map(item =>
								<HaveCountTemplate
									key={ `topic_${activeTab}_${item.pid}` }
									pid={ pid }
									targetPid={ item.pid }
									avatarWebUrl={ item.avatarWebUrl }
									userName={ item.userName }
									companyName={ item.companyName }
									jobTitle={ item.jobTitle }
									count={ item.count }
									major={ item.major }
									schoolName={ item.schoolName }
								>
									{
										(item.connectionStatus === 0 || item.connectionStatus === 1 || item.connectionStatus === 2) &&
										<ChangeCard
											pid={ pid }
											targetPid={ item.pid }
											connectionStatus={ item.connectionStatus }
											mutualFriendCount={ item.count }
										/>
									}
								</HaveCountTemplate>
							)
							: null
						}
						{
							activeTab === 'gallery' &&
							<WorksList
								data={ dataList }
								from={ 'staffList' }
							/>
						}
						{
							activeTab === 'honor' &&
							<HonorList
								listData={ dataList }
								from={ 'staffList' }
							/>
						}
						{ 
							isLoading &&
							<div style={ {width: '100%', height: '25px', marginTop: '15px'} }>
								<div className="ui loading" />
							</div>
						}
					</div>
				</LazyLoading>
			</div>
		);
	}
}

RightBlock.defaultProps = {
	dataList: []
};

export default compose(
	translate([]),
	[CSSModules, '_', css]
)(RightBlock);
