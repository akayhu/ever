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

class Following extends Component {
	constructor(props) {
		super(props);

	}
	render() {
		if( this.props.viewas !== 'self' && this.props.viewasInfo.length > 0 ) return null;
		return	this.props.viewas === 'self'
						? <ChangeCard {...this.props}/>
						: <SubscribePeople {...this.props}/>
	}
}

export default compose(
	//connect(),
	//translate( [] ),
	[CSSModules, '_', css]
)(Following)