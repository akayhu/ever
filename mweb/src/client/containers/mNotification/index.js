import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { getNotificationList } from 'src/client/actions/notification';
import LazyLoading from 'src/util/lazyLoading';
import css from './index.css';
import timeago from 'c_platform/lib/util/timeago';
import Image from 'src/client/components/image';
import moment from 'moment';
import clientConfig from 'src/configs/client';

class MNotification extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.props.getNotificationList();
		window.scrollTo(0, 0);
	}
	loadMore() {
		this.props.getNotificationList('more');
	}
	render() {
		const { dataList, isLoading, error, hasNext } = this.props.notification;
		const { history } = this.props;
		return (
			<main styleName="wrap">
				<LazyLoading loadingAct={ this.loadMore.bind(this) }>
					{ 	// List
						(dataList.length > 0) && (
							<dl styleName="list">
								{
									dataList.map((item, i) => {
										const { createDate, iconUrl, targetLink, message } = item;
										const time = timeago(moment(createDate).format('YYYY-MM-DD HH:mm:ss'));
										let url = targetLink.replace(clientConfig.params.wapUrl, `${clientConfig.params.wapUrl}/m`);
										if (clientConfig.env === 'dev') {
											url = targetLink.replace('plus.104-dev.com.tw', 'plus.104-dev.com.tw/m');
										}

										return (
											<dd styleName="recode hava_img" key={ i } onClick={ () => location.href = url }>
												{ iconUrl && <Image type={ 'avatar' } src={ iconUrl } /> }
												<div styleName="content">
													<div>{ message }</div>
													<div styleName="time">{ time }</div>
												</div>
											</dd>
										);
									})
								}
							</dl>
					)}
					{	// Empty
						(dataList.length === 0) && (!isLoading && !error && !hasNext) &&
							(<p styleName="empty">尚未有任何通知</p>)
					}
					{ // End
						(dataList.length > 0) && (!isLoading && !error && !hasNext) && (
							<div styleName="end">
								沒資料了！<a href="/m">回首頁</a>
							</div>
						)
					}
				</LazyLoading>
				{ // Loading
					isLoading && (
						<div styleName="loading" className="loading-box">
							<div className="loading-animate gray">
								<i /><i /><i />
							</div>
							<span>載入中</span>
						</div>
					)
				}
				{ // Error
					error && (
						<div styleName="error">
							Oops～載入資料發生錯誤！<a href={ history.currentUrl }>點我重整</a>
						</div>
					)
				}
			</main>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		history: state.history,
		notification: state.notification,
	};
}

export default compose(
	connect(mapStateToProps, { getNotificationList }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(MNotification);
