import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { Link } from 'react-router';
import SubscribePeople from 'src/client/component_common/subscribePeople';
import SubscribeMedia from 'src/client/component_channel/buttons/subscribeBtn';

import clientConfig from 'src/configs/client';
import css from './index.css';

class Excellent extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}
	render() {
		const { type, id, ...others } = this.props;
		if(type === 'people') return <SubscribePeople  {...others} />
		else if( type ==='media') return <SubscribeMedia channelId={id} { ...others}/>
	}
}

export default compose(
	//connect(),
	//translate( [] ),
	[CSSModules, '_', css]
)(Excellent)