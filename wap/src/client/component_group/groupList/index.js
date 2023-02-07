import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import cx from 'classnames';
import css from './index.css';
// actions
import { loadDataByCategory } from 'src/client/actions/group';

// components
import Lazyloading from 'src/client/component_common/lazyLoad/list';

class GroupBlockList extends Component {
	constructor(props) {
		super(props);
	}
	loadMore() {
		const { loadDataByCategory, activeTab } = this.props;
		loadDataByCategory(activeTab);
	}

	render() {
		const { gutter, groupDataList, listLoading } = this.props;
		const containerStyle = cx('list_container', {gutter: gutter});
		const dataEmpty = groupDataList.length === 0;
		const loadingStyle = cx('loading_block', {empty: dataEmpty, non_empty: !dataEmpty});
		return (
			<Lazyloading
				loadingAct={ this.loadMore.bind(this) }
				body
			>
				<dl styleName={ containerStyle }>
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
	connect(null, { loadDataByCategory }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(GroupBlockList);
