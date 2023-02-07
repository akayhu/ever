import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { Link } from 'react-router';

import ChangeCard from 'src/client/component_common/changeCard';
import SubscribePeople from 'src/client/component_common/subscribePeople';

import clientConfig from 'src/configs/client';
import css from './index.css';

class MyFollowersAndMayKnow extends Component {
	constructor(props) {
		super(props);
		this.state = { }
	}

	render() {
		return (
			<div styleName="change_subscribed_confirm">
				<ChangeCard {...this.props} />
				<SubscribePeople {...this.props} />
			</div>
		)
	}
}

export default compose(
	//connect(),
	//translate( [] ),
	[CSSModules, '_', css]
)(MyFollowersAndMayKnow)