import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { likeUnlike } from 'src/client/actions/activity';
import { setDirectPanel } from 'src/client/actions/alert';
import { activityEventLog } from 'src/client/actions/activity/activityLog.js';

class LikeButton extends Component {
	constructor(props, context) {
		super(props, context);
		this.likeAction = this.like.bind(this);
	}
	like() {
		if (!this.props.user.isLogin) {
			if (this.props.clickTrigger) {
				// collect這個props是未登入時的alertHint
				this.props.clickTrigger();
			} else {
				this.props.setDirectPanel(true);
				return false;
			}
		} else {
			this.props.likeUnlike(this.props.itemData);
			const likeIt = this.props.itemData.likeIt;
			const clickActivityLog = { 
				pid: this.props.user.pid, 
				page: this.props.pageName ? this.props.pageName : '', 
				filter: this.props.filterName? this.props.filterName:'',
				event:'cool'
			};
			likeIt && !this.props.commitAid ? activityEventLog(this.props.itemData, clickActivityLog) : '';
		}
	}
	render() {
		const likeStyle = (this.props.itemData.likeIt) ? {color: '#0192b5'} : {};
		return (
			<div
				style={ likeStyle }
				styleName="like_btn"
				onClick={ this.likeAction}
				data-gtm-activity="酷"
				className={ this.props.className }
			>
				<i className="icon thumbs up" />酷
			</div>
		);
	}
}

LikeButton.propTypes = {
	clickTrigger: PropTypes.func
};

export default compose(
	connect(null, { likeUnlike, setDirectPanel }),
	[CSSModules, '_', css]
)(LikeButton);
