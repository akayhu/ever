import React, {Component} from 'react';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import cx from 'classnames';
import {funcTexts} from './data';

// style
import css from './index.css';
// selectors
import { getAllFunc, getFunc } from 'src/client/reducers/topic/selectors';
// actions
import { changeFunc } from 'src/client/actions/topic';
// components
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import LoadingBlock from 'src/client/component_common/loadingBlock';
import SubscribePanel from './subscribePanel';

class TopicMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLightBox: false
		};

		this.openLightbox = this.openLightbox.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
	}
	openLightbox() {
		const { isLogin, directToLogin } = this.props;
		if (!isLogin) {
			return directToLogin();
		}
		this.setState({showLightBox: true});
	}
	closeLightbox() {
		this.setState({showLightBox: false});
	}
	renderDescription() {
		const {func, isLogin} = this.props;
		const _func = isLogin ? func : '熱門職場動態';
		if (!isLogin || !_func) return null;
		return (
			<span styleName="description">{`${_func}聚集了與${funcTexts[_func].join('、')}相關的專業文及前輩`}</span>
		)
	}
	render() {
		const {showLightBox} = this.state;
		const {func, allFunc, isLogin, changeFunc} = this.props;
		const {isEmpty, dataList} = allFunc;
		const forList = isEmpty ? [] : dataList;
		const loading = !isEmpty && !dataList.length;
		const _func = isLogin ? func : '熱門職場動態';

		return (
			<div styleName="topic_menu">
				<SubscribePanel
					subscribedList={ dataList }
					show={ showLightBox }
					close={ this.closeLightbox }
				/>
				<LoadingBlock
					height={ 56 }
					show={ loading }
				/>
				<DropdownMenu>
					<DropdownTarget>
						<div
							styleName={ cx('target', {hide: loading}) }
							className="h1"
						>
							{_func}<i className="caret down icon" />
						</div>
					</DropdownTarget>
					<DropdownList>
						<ul className="dropdown" styleName="list">
							{isLogin && forList.map((item, index) =>
								<li styleName="subscribe_item" key={ index } onClick={ changeFunc.bind(this, item) }>
									{item}
								</li>
							)}
							{isLogin && forList.length > 0 && <span styleName="line" />}
							<li onClick={ this.openLightbox }>
								<i className="add circle icon" />{isLogin && forList.length > 0 ? '訂閱管理' : '新增訂閱'}
							</li>
						</ul>
					</DropdownList>
				</DropdownMenu>
				{this.renderDescription()}
			</div>
		);
	}
}
// {isLogin &&
// 					<span>{`${_func}聚集了與${funcTexts[_func].join('、')}相關的專業文及前輩`}</span>
// 				}
function mapStatetoProps(state) {
	return {
		func: getFunc(state),
		isLogin: state.user.isLogin,
		allFunc: getAllFunc(state)
	};
}

export default compose(
	connect(mapStatetoProps, {changeFunc}),
	[CSSModules, '_', css, {allowMultiple: true}]
)(TopicMenu);
