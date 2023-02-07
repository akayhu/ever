import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
// action
import {
	modifyPublishAppraiseText,
	publishAppraiseText,
	deleteAppraiseText,
	deletePenddingAppraise
} from 'src/client/actions/social';
// components
import { DropdownMenu, DropdownTarget, DropdownList, DropList } from 'c_wap_module';
import Image from 'src/client/component_common/image';
import timeAgo from 'c_platform/lib/util/timeago';

class LightboxAppraiseItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			targetIndex: 1,
			targetValue: '公開',
			trash: false,
			loading: false,
			deleting: false,
			privacySetting: 1,
			ui: {
				privacySetting: {
					index: 1,
					targetName: '公開',
					targetStyle: null,
					targetIcon: 'world icon'
				}
			}
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleOnSelected = this.handleOnSelected.bind(this);
	}

	handleSubmit() {
		this.setState({loading: true});
		const params = {
			pid: this.props.pid,
			// targetPid: this.props.selfpid,
			privacySetting: this.state.privacySetting
		};
		this.props.modifyPublishAppraiseText(params).then(() => {
			this.setState({loading: false});
		});
	}

	handleDelete() {
		this.setState({loading: true});

		if (!this.state.deleting) {
			this.state.deleting = true;
			const { privateSetting } = this.props;
			const params = {
				pid: this.props.pid,
				// targetPid: this.props.selfpid
			};
			this.props.deleteAppraiseText(params).then(() => {
				if (privateSetting === -1) {
					this.props.deletePenddingAppraise(params);
				}
				this.setState({loading: false});
			});
		}
	}

	toggleOpen(key) {
		this.state.ui[ key ].targetStyle = open ? { color: 'rgb(38,151,185)' } : null;
		this.setState({
			ui: this.state.ui
		})
	}

	handleOnSelected(data) {
		this.state.privacySetting = data.value;
	}
	changePublishState(index, value, key) {
		this.setState({loading: true});
		const params = {
			pid: this.props.pid,
			// targetPid: this.props.selfpid,
			privacySetting: index
		};
		this.props.publishAppraiseText(params).then(() => {
			this.setState({loading: false});
		});
	}

	render() {
		const {avatarWebUrl, userName, pid, viewas, text, privateSetting, dataDate} = this.props;
		return (
			<div styleName="lb_user_box">
				{
					this.state.loading &&
					<div styleName="loading_cover"><div className="ui loading" /></div>
				}
				<div styleName="lb_user_left">
					<a href={ `/profile/${pid}` } >
						<Image
							src={ avatarWebUrl }
							type="avatar"
						/>
					</a>
				</div>
				<div styleName="lb_user_right">
					<div styleName="lb_right_top">
						<a href={ `/profile/${pid}` } >
							{ userName || 'No Name' }
						</a>
						{ viewas === 'self' && privateSetting !== -1 &&
							<DropdownMenu toggleOpen={ this.toggleOpen.bind(this, 'privacySetting') }>
								<DropdownTarget>
									{privateSetting === 1 && <i className="world icon" />}
									{privateSetting === 0 && <i className="lock icon" />}
								</DropdownTarget>
								<div className="dropdownList">
									<DropdownList>
										<ul className="dropdown">
											<li onClick={ this.changePublishState.bind(this, 1, '公開', 'privacySetting', 'world icon') }>
												<i className="world icon" aria-hidden="true" /> 公開
											</li>
											<li onClick={ this.changePublishState.bind(this, 0, '只限本人', 'privacySetting', 'lock icon') }>
												<i className="lock icon" aria-hidden="true" /> 只限本人
											</li>
										</ul>
									</DropdownList>
								</div>
							</DropdownMenu>
						}
						{ viewas === 'self' && privateSetting !== -1 &&
							<DropdownMenu>
								<DropdownTarget>
									<i className="trash icon" />
								</DropdownTarget>
								<DropdownList>
									<div styleName="lb_confirm_panel">
										<p>是否要刪除此筆讚美</p>
										<button
											className="ui primary button"
											styleName="lb_check_button"
											onClick={this.handleDelete}
										>
											確認
										</button>
										<button
											className="ui normal button"
											styleName="lb_check_button"
											onClick={()=>false}
										>
											取消
										</button>
									</div>
								</DropdownList>
							</DropdownMenu>
						}
					</div>
					<div styleName="lb_right_mid">
						<p className="statics_text">{ text }</p>
					</div>
					<div styleName="lb_right_bot">
						<p>{ timeAgo(dataDate) }</p>
					</div>
				</div>
				{
					privateSetting === -1 &&
					<div styleName="lb_check_publicy">
						<span className="dropListSpan">
							<DropList
								listContent={[
										{label: '公開', value: 1, iconFont: 'world icon'},
										{label: '只限本人', value: 0, iconFont: 'lock icon'}
									]}
								onSelected={ this.handleOnSelected}
								defaultIndex={ 1 }
								className="dropList"
								width="125px"
							>
							</DropList>
						</span>
						<button
							className="ui primary button"
							styleName="lb_check_button"
							onClick={this.handleSubmit}
						>
							送出
						</button>
						<button
							className="ui normal button"
							styleName="lb_check_button"
							onClick={this.handleDelete}
						>
							刪除
						</button>
					</div>
				}
			</div>
		)
	}
}

LightboxAppraiseItem.propTypes = {
	avatarWebUrl: PropTypes.string,
	userName: PropTypes.string,
	pid: PropTypes.number,
	viewas: PropTypes.string,
	text: PropTypes.string,
	privateSetting: PropTypes.number,
	dataDate: PropTypes.string,
	modifyPublishAppraiseText: PropTypes.func,
	publishAppraiseText: PropTypes.func,
	deleteAppraiseText: PropTypes.func,
	deletePenddingAppraise: PropTypes.func
};
const actions = {
	modifyPublishAppraiseText,
	publishAppraiseText,
	deleteAppraiseText,
	deletePenddingAppraise
};
const LightboxAppraiseItemCss = CSSModules(LightboxAppraiseItem, css, { allowMultiple: true });
const LightboxAppraiseItemTranslate = translate([])(LightboxAppraiseItemCss);
export default connect(null, actions)(LightboxAppraiseItemTranslate);
