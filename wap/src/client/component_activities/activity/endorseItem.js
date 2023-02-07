import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { LightBox } from 'c_wap_module';
import compose from 'src/util/compose';

import { showPlatformAlert } from 'src/client/actions/alert';
import { deleteEndorsementItem, deleteEndorsement, addEndorsement } from 'src/client/actions/activity';

class EndorseItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLightbox: false,
		};
	}
	openLightbox() {
		this.setState({showLightbox: true});
	}
	submit() {
		const { deleteEndorsementItem, itemData, data } = this.props;
		deleteEndorsementItem(itemData, data);
		this.setState({ showLightbox: false });
	}
	closeAlert() {
		this.setState({ showLightbox: false });
	}
	endorseIt() {
		const { user, showHint, author, itemData, data, index, deleteEndorsementItem, deleteEndorsement, addEndorsement, isExpectEndorse } = this.props;

		// 為黑名單時無法操作
		if (this.props.itemData.userInfo.blockStatus) {
			return this.props.showPlatformAlert('權限不足，無法操作這個動作');
		}

		if (!user.isLogin) {
			showHint();
			return;
		}

		// 是作者預設的肯定時不能刪除
		if (isExpectEndorse) {
			return;
		}

		if (author) {
			if (data.count > 0) {
				this.setState({showLightbox: true});
			} else {
				// deleteEndorsementItem連同刪除給予肯定的背書人，限文章作者操作
				deleteEndorsementItem(itemData, data);
			}
			return;
		}

		// deleteEndorsement用途等同於取消肯定，pid請由登入者取得
		if (itemData.endorseHoneyPot[index].endorseIt) {
			deleteEndorsement(itemData, data);
		} else {
			addEndorsement(itemData, data);
		}
	}
	render() {
		const styleColor = (this.props.data.endorseIt) ? 'endorseIt' : '';
		const cursorStyle = (this.props.isExpectEndorse) ? 'noCursor' : '';
		const lightboxObtion = {
			submit: {
				text: '確定',
				action: this.submit.bind(this)
			},
			cancel: {
				text: '取消'
			},
			title: '刪除肯定'
		};
		return (
			<div styleName={ `endorse ${styleColor} ${cursorStyle}` }>
				<div onClick={ this.endorseIt.bind(this) }>
					{
						this.props.data.count > 0 &&
						<div styleName="count" data-gtm-endorse="肯定項">{this.props.data.count}</div>
					}
					<div styleName="itemname">
						<span style={ {marginRight: '5px'} } data-gtm-endorse="肯定項">{ this.props.data.item }</span>
						{
							(this.props.author && !this.props.isExpectEndorse) &&
							<i className="cross icon" />
						}
					</div>
				</div>
				{
					this.state.showLightbox &&
					<LightBox
						option={ lightboxObtion }
						open={ this.openLightbox.bind(this) }
						onClose={ this.closeAlert.bind(this) }
						clickOverlayToClose
					>
						<div style={ {color: 'black'} }>{this.props.data.item}已經被{this.props.data.count}個人肯定，刪除後被肯定的數量無法還原，是否確定刪除？</div>
					</LightBox>
				}
			</div>
		);
	}
}

export default compose(
	connect(null, { deleteEndorsementItem, deleteEndorsement, addEndorsement, showPlatformAlert }),
	translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(EndorseItem);
