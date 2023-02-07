import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import LeftSideNavigation from 'src/client/component_common/leftSideNavigation';
import { components as CPlatformComponents } from 'c_platform';
import { updatePersonalConfig, loadUserConfig, initUserConfig } from 'src/client/actions/profile';
import clientConfig from 'src/configs/client';
import DropList from './dropList';
import NewsletterSetting from './newsletter';
import NotificationSetting from './notification';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class Newsletter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			init: true,
			uploading: false,
			preUploadData: {},
			dataKeyArray: [],
		};
		this.optionSelect = (key, value) => this.optionSelectd(key, value);
		this.submit = () => this.submitit();
		this.cancel = () => this.cancelit();
	}
	componentWillMount() {
		this.props.loadUserConfig().then(() => { this.setState({ init: false }); });
	}
	optionSelectd(key, value) {
		if (!this.state.preUploadData.hasOwnProperty(key)) this.state.dataKeyArray.push(key);
		const resultObj = {};
		resultObj[key] = value;
		this.setState({ preUploadData: Object.assign({}, this.state.preUploadData, resultObj)});
	}
	getDefaultIndex(options, value) {
		for (let i = 0; i < options.length; i += 1) {
			if (options[i].value === value) {
				return (i + 1);
			}
		}
		return 1;
	}
	submitit() {
		if (!this.state.uploading && this.state.dataKeyArray.length !== 0) { // 防呆
			this.setState({ uploading: true });
			const updateData = this.state.dataKeyArray.map((obj) => {
				return { type: obj, value: this.state.preUploadData[obj] };
			});
			this.props.updatePersonalConfig({ updateData: JSON.stringify(updateData) }).then(() => {
				this.setState({ uploading: false, preUploadData: {}, dataKeyArray: [] }); // init
			});
		}
	}
	cancelit() {
		if (this.state.dataKeyArray.length !== 0) { // 防呆
			this.setState({ init: true, preUploadData: {}, dataKeyArray: [] });
			this.props.initUserConfig().then(() => { this.setState({ init: false, uploading: false }); }); // force to update
		}
	}
	createLeftSideNavigation(activeTab) {
		return {
			activeTab,
			navList: [
				{
					title: '電子報設定',
					itemKey: 'newsletter',
					count: 0,
					url: '/newsletter',
					subItems: []
				}
			]
		};
	}
	render() {
		if (this.state.init) return false;
		const activeTab = this.props.location.query.category || 'newsletter';
		const navSetting = this.createLeftSideNavigation(activeTab);
		const { config } = this.props;
		const dropListConfig = (activeTab === 'newsletter') ? NewsletterSetting : NotificationSetting;
		return (
			<ViewWrapper { ...this.props } >
				<div className="container_wrap original_panel" styleName="wrapper">
					<div className="header">
						<h2>電子報設定</h2>
					</div>
					<div className="wrap_w300_m0_w660 body">
						<div className="left_side aside">
							<LeftSideNavigation navSetting={ navSetting } />
						</div>
						<div className="right_side main">
							<div styleName="newsletter_main">
								<div>
									在此設定104職涯社群電子報及寄送頻率。<br />
									若要變更收件信箱，可至<a href={ 'https:' + clientConfig.params.accountsUrl + '/hello?p=' + this.props.user.aesPid } target="_blank" rel="noopener noreferrer">會員中心</a>修改。
								</div>
								<table>
									{
										dropListConfig.map((obj) => {
											const defaultValue = config[obj.key].value;
											return (
												<DropList
													key={ obj.key }
													keyName={ obj.key }
													text={ obj.text }
													option={ obj.option }
													defaultIndex={ this.getDefaultIndex(obj.option, defaultValue) }
													onSelect={ this.optionSelect }
												/>
											);
										})
									}
								</table>
								<div styleName="actions">
									<button
										className={ (this.state.uploading) ? 'loading ui primary button' : 'ui primary button' }
										onClick={ this.submit } >儲存</button>
									<button className="ui normal button" onClick={ this.cancel } >取消</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		config: state.profile.config,
		user: state.user
	};
};

export default compose(
		connect(mapStateToProps, { updatePersonalConfig, loadUserConfig, initUserConfig }),
		// translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(Newsletter);
