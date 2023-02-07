import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import cx from 'classnames';
import compose from 'src/util/compose';
import css from './index.css';
import Lazyloading from 'src/client/component_common/lazyLoad/list';
import { loadDataCenter } from 'src/client/actions/channel';

class ChannelList extends Component {
	constructor(props) {
		super(props);
	}
	loadMore() {
		const { loadDataCenter, activeTab } = this.props;
		loadDataCenter(activeTab);
	}
	render() {
		const { channelDataList, listLoading } = this.props;
		const dataEmpty = channelDataList.length === 0;
		const loadingStyle = cx('loading_block', {empty: dataEmpty, non_empty: !dataEmpty});
		return (
			<Lazyloading body loadingAct={ this.loadMore.bind(this) }>
				<dl styleName="channel_block">
					{ this.props.children }
					{ listLoading &&
						<div styleName={ loadingStyle }>
							<div className="ui loading" />
						</div>
					}
				</dl>
			</Lazyloading>
		);
	}
}

export default compose(
	connect(null, {loadDataCenter}),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ChannelList);
