import React, { Component } from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { NameCard, GroupCard, ChannelCard } from 'src/client/component_common/card';
import timeAgo from 'c_platform/lib/util/timeago';
import compose from 'src/util/compose';

class Header extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { inChannel } = this.props;
		const { userInfo, channelId, channelInfo} = this.props.itemData;
		const hasChannelInfo = (!inChannel && channelId !== null && typeof (channelId) !== 'undefined');
		let channelCard;

		if (hasChannelInfo) {
			if (channelInfo.type === 10) {
				channelCard = <ChannelCard id={ channelId }	name={ channelInfo.name }	textMode />;
			} else if (channelInfo.type === 7 || channelInfo.type === 8) {
				channelCard = <GroupCard id={ channelId }	name={ channelInfo.name }	textMode />;
			}
		}
		return (
			<div className="h3 main_text clearfix" styleName="activity_header">
				<div styleName="header_img">
					{
						(!hasChannelInfo || (hasChannelInfo && channelInfo.type !== 10)) &&
						<NameCard
							targetPid={ userInfo.pid }
							key={ userInfo.pid }
							href={ `/profile/${userInfo.pid}` }
							imgSrc={ userInfo.userFileUrl }
							name={ userInfo.userName }
						/>
					}
					{
						(hasChannelInfo && channelInfo.type === 10) &&
						<ChannelCard
							imgSrc={ channelInfo.avatarWebUrl }
							name={ channelInfo.name }
							id={ channelInfo.id }
						/>
					}
				</div>
				<div styleName="header_text">
					<div styleName="user_info" className="clearfix">
						<div styleName="left">
							{
								(!hasChannelInfo || (hasChannelInfo && channelInfo.type !== 10)) &&
								<NameCard
									targetPid={ userInfo.pid }
									key={ userInfo.pid }
									href={ `/profile/${userInfo.pid}` }
									imgSrc={ userInfo.userFileUrl }
									name={ userInfo.userName }
									textMode
								/>
							}
							{
								(hasChannelInfo && channelInfo.type !== 10) &&
								<i className="triangle right icon" styleName="arrow" />
							}
							{
								hasChannelInfo &&
								channelCard
							}
						</div>
						{/* <div styleName="right">
							{ this.props.children }
						</div> */}
					</div>
					<div styleName="job_info">
						{
							!hasChannelInfo &&
							<div className="statics_text" styleName="left">
								<span>{this.props.itemData.userInfo.userJobTitle}</span>
								<span>{this.props.itemData.userInfo.userCompany}</span>
							</div>
						}
						<div className="statics_text" styleName="right" title={ this.props.itemData.createDateStr }>{timeAgo(this.props.itemData.createDateStr)}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default compose(
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Header);
