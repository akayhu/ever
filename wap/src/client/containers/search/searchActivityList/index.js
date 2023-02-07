import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
// import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import SearchActivity from 'src/client/component_search/searchlist/activity';

class SearchActivityList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { params, user } = this.props;
		return (
			<SearchActivity
				mode={ params.mode }
				keyword={ params.keyword }
				splat={ params.splat }
				pid={ user.pid }
			/>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	};
}

export default compose(
	connect(mapStateToProps),
	// translate([]),
	// [CSSModules, '_', css, { allowMultiple: true }]
)(SearchActivityList);
