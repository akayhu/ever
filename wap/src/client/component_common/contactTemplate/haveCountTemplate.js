import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import {connect} from 'react-redux';
import DOMPurify from 'dompurify';
import { has } from 'lodash/object';

import highlight from 'src/util/StringUtil';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import { LightBox } from 'c_wap_module';
import { Link } from 'react-router';
import { NameCard } from 'src/client/component_common/card';
import { NoCountTemplate } from 'src/client/component_common/contactTemplate';

import { loadDataByCategory } from 'src/client/actions/connection';

class HaveCountTemplate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLightBox: false
		};
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	openMutualFriendLightbox(targetPid) {
		this.props.loadDataByCategory('mutualFriends', {targetPid});
		this.handleLightBox(true);
	}
	handleLightBox(isShow) {
		this.setState({showLightBox: isShow});
	}
	loadMore() {
		const { targetPid } = this.props;
		const { count, end } = this.props.mutualfriends;
		if (!end) {
			this.props.loadDataByCategory(
				'mutualFriends',
				{
					targetPid,
					offset: count
				}
			);
		}
	}
	render() {
		const {
			pid,
			targetPid,
			avatarWebUrl,
			userName,
			companyName,
			jobTitle,
			count,
			major,
			schoolName,
			children,
			mutualfriends,
			keyword,
			extra,
			hiddenStatus
		} = this.props;
		let jobOrSchool = jobTitle !== null
											? companyName !== null
												? `${jobTitle}　${companyName}`
												: `${major}　${schoolName}`
											: '';
		let name = userName;
		if (keyword) {
			jobOrSchool = highlight(DOMPurify.sanitize(jobOrSchool), keyword);
			name = highlight(DOMPurify.sanitize(userName), keyword);
		}
		return (
			<div styleName="lb_box">
				<div styleName="lb_left">
					<NameCard
						targetPid={ targetPid }
						href={ `/profile/${targetPid}` }
						imgSrc={ avatarWebUrl }
						name={ userName }
						hiddenStatus={ hiddenStatus }
					/>
				</div>
				<div styleName="lb_right">
					<div styleName="lb_right_top" title={ userName }>
						<Link
							to={ `/profile/${targetPid}` }
							dangerouslySetInnerHTML={ { __html: name } }
						/>
						{
							extra &&
							<span styleName="extra"> - { extra }</span>
						}
					</div>
					<div styleName="lb_right_bottom" title={ `${companyName} ${jobTitle}` }>
						<p dangerouslySetInnerHTML={ {__html: jobOrSchool} } />
					</div>
					{
						count > 0 && pid !== targetPid &&
						<div styleName="lb_right_bottom" title={ `${count}個共同好友` }>
							<a
								href="javascript:;"
								onClick={ this.openMutualFriendLightbox.bind(this, targetPid) }
							>
								{ count } 個共同好友
							</a>
						</div>
					}
				</div>
				<div styleName="lb_btn">
					{ children }
				</div>
				{
					this.state.showLightBox &&
					<LightBox option={ {closeIcon: true, title: `與 ${userName} 的共同好友`} } onClose={ this.handleLightBox.bind(this, false) }>
						<LazyLoading loadingAct={ this.loadMore.bind(this) }>
							<div styleName="mutual_lb">
								{
									has(mutualfriends, 'dataList') && mutualfriends.dataList.map((item, key) =>
										<NoCountTemplate key={ key } { ...item } />
									)
								}
								{ has(mutualfriends, 'loading') && mutualfriends.loading &&
									<div style={ {width: '100%', height: '25px', marginTop: '15px'} }>
										<div className="ui loading" />
									</div>
								}
							</div>
						</LazyLoading>
					</LightBox>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		mutualfriends: state.connection.mutualFriends[props.targetPid],
	};
}

export default compose(
	connect(mapStateToProps, { loadDataByCategory }),
	translate([]),
	[CSSModules, '_', css]
)(HaveCountTemplate);
