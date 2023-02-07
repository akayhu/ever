import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
// import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import SearchGroup from 'src/client/component_search/searchlist/group';

class SearchGroupList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { params, user } = this.props;
		return (
			<SearchGroup
				condition={ { } }
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
)(SearchGroupList);
