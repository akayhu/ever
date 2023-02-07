import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import LikeButton from 'src/client/component_common/likeBtn';
import CollectButton from 'src/client/component_common/collectBtn';
import ShareButton from 'src/client/component_common/shareBtn';
import clientConfig from 'src/configs/client';

class Behavior extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { index, itemData, user, pageName, filterName } = this.props;
		const url = `${clientConfig.params.wapUrl}/activity/${this.props.itemData.aid}`;
		return (
			<div className="statics_text" styleName="behavior" >
				<LikeButton 
					itemData={ itemData } index={ index } 
					clickTrigger={ this.props.showHint } 
					user={ user } 
					pageName={pageName}
					filterName={filterName}
				/>
				<div styleName="item_line" />
				<CollectButton 
					itemData={ itemData } 
					index={ index } 
					clickTrigger={ this.props.showHint } 
					user={ user } 
					pageName={pageName}
					filterName={filterName}
				/>
				<div styleName="item_line" />
				<ShareButton url={ url } />
			</div>
		);
	}
}

const BehaviorCss = CSSModules(Behavior, css, { allowMultiple: true });

export default BehaviorCss;
