import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'src/util/compose';
import CSSModules from 'react-css-modules';
import css from './index.css';
// actions
import { prepareEndorseIt } from 'src/client/actions/activity';

class ActivityEndorse extends Component {
	constructor(props) {
		super(props);
	}
	endorseIt(index) {
		const { user, activitiesPool, prepareEndorseIt, aid } = this.props;
		const { userInfo, editable, endorseHoneyPot, pid } = activitiesPool[aid];
		if (!user.isLogin) return console.error('請先登入');
		if (editable) return console.error('作者無法操作');

		if (endorseHoneyPot[index].endorseIt) {
			// 收回肯定
			prepareEndorseIt('收肯定', {
				aid,
				item: endorseHoneyPot[index].item,
			});
		} else {
			// 給予肯定
			prepareEndorseIt('給肯定', {
				aid,
				authorPid: pid,
				item: endorseHoneyPot[index].item,
			});
		}
	}
	render() {
		if (!this.props.activitiesPool) return null;
		const { aid, activitiesPool, endorseCount } = this.props;
		const { userInfo, endorseHoneyPot } = activitiesPool[aid];
		return (
			<div styleName="endorse">
				<span styleName="title">
					{
						endorseHoneyPot.length === 0
						?	'這篇文章尚未開放肯定'
						: `根據這篇分享，你想肯定${userInfo.userName}什麼專業？`
					}
				</span>
				<div styleName="main">
					{
					endorseHoneyPot.map((endorse, index) => (
						<div styleName={ `item ${endorse.endorseIt ? 'active' : ''}` } onClick={ this.endorseIt.bind(this, index) }>
							{
								endorse.count !== 0 &&
								<div styleName="count">{endorse.count}</div>
							}
							<div
								styleName="text"
								style={ endorse.count === 0 ? {borderRadius: '4px'} : null }
								data-gtm-endorse="肯定項"
							>
								{endorse.item}
							</div>
						</div>
					))
				}
				</div>
			</div>
		);
	}
}

function selector(state) {
	return {
		activitiesPool: state.entities.activities,
	};
}

export default compose(
	connect(selector, { prepareEndorseIt }),
	[CSSModules, '_', css, { allowMultiple: true }],
)(ActivityEndorse);
