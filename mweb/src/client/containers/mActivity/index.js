import React from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import ActivityMaster from 'src/client/components/activity/module/master';
import Announcement from 'src/client/components/announcement/index';
// actions
import { initSinglePage, activeActivity } from 'src/client/actions/activity';

class MActivity extends React.Component {
	constructor(props) {
		super(props);
	}
	componentWillMount() {
		const { aid } = this.props.params;
		this.props.initSinglePage(aid);
		this.props.activeActivity(aid);
	}
	render() {
		const { activitiesPool, user } = this.props;
		const { aid } = this.props.params;
		if (Object.keys(activitiesPool).length === 0) return null;
		return (
			<main styleName="wrap">
				<Announcement />
				<ActivityMaster
					user={ user }
					rootStyle={ { padding: '12px 12px 0 12px' } }
					itemData={ activitiesPool[aid] }
					aid={ aid }
					master={ true }
					pageName="activity"
				/>
			</main>
		);
	}
}

function mapStateToProps(state) {
	// console.log(state);
	return {
		user: state.user,
		activitiesPool: state.entities.activities,
	};
}

export default compose(
	connect(mapStateToProps, { initSinglePage, activeActivity }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(MActivity);
