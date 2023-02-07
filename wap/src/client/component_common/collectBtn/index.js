import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import clientConfig from 'src/configs/client';

// actions
import { collectNotcollect } from 'src/client/actions/activity';
import { setDirectPanel } from 'src/client/actions/alert';
import { activityEventLog } from 'src/client/actions/activity/activityLog.js';

class CollectButton extends Component {
	constructor(props) {
		super(props);
		this.clickAction = this.collect.bind(this);
	}
	collect() {
		if (!this.props.user.isLogin) {
			if (this.props.clickTrigger) {
				// collect這個props是未登入時的alertHint
				this.props.clickTrigger();
			} else {
				this.props.setDirectPanel(true);
				return false;
			}
		} else {
			this.props.collectNotcollect(this.props.itemData);
			const collectIt = this.props.itemData.collectIt;
			const clickActivityLog = { 
				pid: this.props.user.pid, 
				page: this.props.pageName ? this.props.pageName : '', 
				filter: this.props.filterName? this.props.filterName:'',
				event:'collect'
			};
			collectIt && !this.props.commitAid ? activityEventLog(this.props.itemData, clickActivityLog) : '';
		}
	}
	render() {
		const collectStyle = (this.props.itemData.collectIt) ? {color: '#0192b5'} : {};
		return (
			<div
				style={ collectStyle }
				styleName="collect_btn"
				onClick={ this.clickAction }
				data-gtm-activity="收藏"
				className={ this.props.className }
			>
				<i className="icon bookmark" />收藏
			</div>
		);
	}
}

CollectButton.propTypes = {
	clickTrigger: PropTypes.func
};

export default compose(
	connect(null, { collectNotcollect, setDirectPanel }),
	[CSSModules, '_', css]
)(CollectButton);
