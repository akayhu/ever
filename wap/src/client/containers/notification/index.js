import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { getNotificationList } from 'src/client/actions/notification';
// components
import ListItem from 'src/client/component_notification/listItem';
import Loading from 'src/client/component_notification/loading';
import EError from 'src/client/component_notification/error';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import {components as CPlatformComponents} from 'c_platform';
import $ from 'jquery';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class Notification extends Component {
	constructor(props) {
		super(props);

		this.state = {
			category: props.location.query.category || 'group'
		};
	}
	componentDidMount() {
		if (!this.props.isLogin) this.redirect();
		$('html').addClass('full_height');

		this.props.getNotificationList();
		this.prevPage = window.elogPage;
		window.elogPage = 'notification';
	}
	componentWillUnmount() {
		$('html').removeClass('full_height');
		window.elogPage = this.prevPage;
	}
	redirect() {
		const url = '/sso/saml-login?r=/notification';
		location.href = url;
	}
	loadMore() {
		this.props.getNotificationList('more');
	}
	render() {
		return (
			<ViewWrapper { ...this.props } >
				<div className="container_wrap original_panel" styleName="wrapper">
					<div className="header clearfix">
						<div className="title">
							<h2>收到的通知</h2>
						</div>
					</div>
					<div className="wrap_w300_m0_w660 body" styleName="fix_display">
						<LazyLoading loadingAct={ this.loadMore.bind(this) }>
							<div className="main">
								{
									(this.props.dataList.length === 0)
										? <p styleName="empty">尚未有任何通知</p>
										: <dl>
											{
												this.props.dataList.map((item, index) => (
													<ListItem
														key={ index }
														{ ...item }
														pageName="notification"
													/>
												))
											}
											{this.props.loading && <Loading />}
											{this.props.error && <EError />}
										</dl>
								}
							</div>
						</LazyLoading>
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

const mapStateToProps = state => (
	{
		dataList: state.notification.dataList,
		error: state.notification.error,
		loading: state.notification.isLoading,
		isLogin: state.user.isLogin
	}
);

export default compose(
		connect(mapStateToProps, { getNotificationList }),
		// translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Notification);
