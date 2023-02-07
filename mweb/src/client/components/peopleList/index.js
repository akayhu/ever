import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import ga from 'react-ga';
import PeopleItem from 'src/client/components/peopleItem';
import Interaction from 'src/client/components/interaction';
import LazyLoading from 'src/util/lazyLoading';

class PeopleList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { loadingAct, dataList, loading, error, end, hasButton, haveSubKey, itemWrapStyle, isLogin, body, history } = this.props;
// console.log(isLogin);
		return (
			<div>
				<LazyLoading body={body} loadingAct={ loadingAct }>
					<div styleName="people_dl">
						{
							dataList &&
							dataList.map((data, key) => {
								let itemData = data;
								if (!itemData) return null;
								// activity 酷、肯定、收藏，的人列表會有subKey
								// activity 裡面的人列表key值與其他的地方不一樣，所以要換一次
								if (haveSubKey) {
									const o = itemData[haveSubKey];
									itemData = {
										pid: o.pid,
										userName: o.userName,
										avatarWebUrl: o.userFileUrl,
										companyName: o.userCompany,
										jobTitle: o.userJobTitle,
									}
								};
								return (
									<PeopleItem
										key={ key }
										styleName="people_dl"
										userObj={ itemData }
										hasButton={ hasButton }
										wrapStyle={ itemWrapStyle }
									>
										<Interaction
											targetPid={ itemData.pid }
											isLogin={isLogin}
											connectionStatus={ itemData.connectionStatus }
										/>
									</PeopleItem>
								);
							})
						}
					</div>
				</LazyLoading>
				{
					loading &&
					<div styleName="loading" className="loading-box">
						<div className="loading-animate gray">
							<i></i><i></i><i></i>
						</div>
						<span>載入中</span>
					</div>
				}
				{
					!loading && error &&
					<div styleName="error">
						Oops～載入資料發生錯誤！<a href={history.currentUrl}>點我重整</a>
					</div>
				}
				{
					!loading && end &&
					<div styleName="end">
						沒資料了！<a href="/m">回首頁</a>
					</div>
				}
			</div>
		);
	}
}

PeopleList.defaultProps = {
	loadingAct: () => null,
};

function mapStateToProps(state, props) {
	return {
		isLogin: state.user.isLogin,
		history: state.history,
	};
}

export default compose(
	connect(mapStateToProps),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(PeopleList);
