import { connect } from 'react-redux';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { queryViewer, queryViewerFromPro } from 'src/client/actions/accessRecord';
import { LightBox } from 'c_wap_module';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import { NameCard } from 'src/client/component_common/card';
import Image from 'src/client/component_common/image';
import clientConfig from 'src/configs/client';
import compose from 'src/util/compose';
import LightboxListItem from 'src/client/component_profile/lightboxlist/lightboxList';
import LightboxListCompany from 'src/client/component_profile/lightboxlist/lightboxListCompany';
// 誰來看過我
class WhoSeeMe extends React.Component {
	constructor() {
		super();
		this.state = {
			lightboxMode: '',
		};
		this.lightboxPersonContent = [];
		this.lightboxComponyContent = [];
		this.lightboxDataInit = false;
		this.handleLightbox = mode => this.lightboxOpen.bind(this, mode);
	}
	componentDidMount() {
		this.props.queryViewer();
		this.props.queryViewerFromPro();
	}
	lightboxOpen(lightboxMode) {
		if (this.lightboxPersonContent.length === 0 && !this.lightboxDataInit) {
			this.lightboxPersonContent = this.props.accessRecord.queryViewer.viewerInfo.map(item => (<LightboxListItem key={ item.pid } personData={ item } />));
		} else if (this.lightboxPersonContent.length !== 0 && !this.lightboxDataInit) {
			this.lightboxPersonContent.push(<p styleName="noSee">目前沒有人看過我</p>);
		}
		if (this.lightboxComponyContent.length === 0 && !this.lightboxDataInit) {
			this.lightboxComponyContent = this.props.accessRecord.queryViewerFromPro.comViewerInfo.map((item) => {
				const link = `${clientConfig.params.e104Url}/jobbank/custjob/index.php?j=${item.custNo}`;
				const logoUrl = `${clientConfig.params.e104Url}/upload1/logo/1104_${item.logo}`;
				return	(<LightboxListCompany key={ item.custNo }	href={ link } logoUrl={ logoUrl } custName={ item.custName }	/>);
			});
		} else if (this.lightboxComponyContent.length === 0 && !this.lightboxDataInit) {
			this.lightboxComponyContent.push(<p styleName="noSee">目前沒有企業看過我</p>);
		}
		this.lightboxDataInit = true;
		this.setState({ lightboxMode });
	}
	render() {
		const { queryViewer, queryViewerFromPro } = this.props.accessRecord;

		const lightboxOption = {
			closeIcon: true,  // 有無close ICON,
			contentHeight: '405px',
		};
		const { lightboxMode } = this.state;
		return (
			<div>
				{
				((queryViewer.viewerInfo.length !== 0) || (queryViewerFromPro && queryViewerFromPro.comViewerInfo.length !== 0)) &&
				<div>
					<SocialComponentTitle maintitle="誰看過我" />
					<div styleName="see_me_main_border">
						<div styleName="popularity">
							{
								queryViewer.pv > 0 &&
								<span>今日人氣{ queryViewer.pv }</span>
							}
							{
								queryViewer.totalPv > 0 &&
								<span> 累積人氣{ queryViewer.totalPv }</span>
							}
						</div>
						<div styleName="see_me_for_peo">
							{
								queryViewer.viewerInfo.length > 0 &&
								<div className="bodyText" styleName="see_me_for_peo_title">
									有<a
										href="javascript: void(0);"
										onClick={ this.handleLightbox('queryViewer') }
										data-gtm-profile-social="誰看過我 - 人總數"
									>
										{ queryViewer.viewerInfo.length }
									</a> 個人看過我
								</div>
							}
							{
								queryViewer.viewerInfo.length > 0 &&
								queryViewer.viewerInfo.slice(0, 5).map(item => (
									<NameCard
										filter={ item.pid }
										pid={ this.props.user.pid }
										targetPid={ item.pid }
										key={ item.pid }
										href={ `/profile/${item.pid}` }
										imgSrc={ item.avatarWebUrl }
										name={ item.userName }
										gtm={ { 'data-gtm-profile-social': '誰看過我 - avatar' } }
									/>
									))
							}
						</div>
						{
							queryViewerFromPro && queryViewerFromPro.comViewerInfo.length > 0 &&
							<div styleName="see_me_for_com">
								<div className="bodyText" styleName="see_me_for_peo_title">
									有<a
										href="javascript: void(0);"
										onClick={ this.handleLightbox('queryViewerFromPro') }
										data-gtm-profile-social="誰看過我 - 公司總數"
									>
										{ queryViewerFromPro.comViewerInfo.length }</a> 家企業看過我
								</div>
								{
									queryViewerFromPro.comViewerInfo.slice(0, 2).map((item) => {
										const link = `${clientConfig.params.e104Url}/jobbank/custjob/index.php?j=${item.custNo}`;
										const logoUrl = `${clientConfig.params.e104Url}/upload1/logo/1104_${item.logo}`;
										return (
											<a key={ item.custNo } href={ link } target="_blank" rel="noopener noreferrer">
												<Image
													type={ 'company' }
													title={ item.custName }
													data-gtm-profile-social="誰看過我 - logo"
													src={ logoUrl }
												/>
											</a>
										);
									})
								}
							</div>
						}
					</div>
					{
						lightboxMode !== '' &&
						<LightBox option={ lightboxOption } onClose={ this.handleLightbox('') }>
							<div styleName="lightWidth">
								<ul className="tabs">
									<li
										className={ (lightboxMode === 'queryViewer') ? 'active' : '' }
										onClick={ this.handleLightbox('queryViewer') }
									>
										看過我的人
									</li>
									<li
										className={ (lightboxMode === 'queryViewerFromPro') ? 'active' : '' }
										onClick={ this.handleLightbox('queryViewerFromPro') }
									>
										看過我的公司
									</li>
								</ul>
								<div styleName="lbContainer">
									<div styleName="see_me_light_box">
										<div styleName="lightbox_list">
											{ (lightboxMode === 'queryViewer') ? this.lightboxPersonContent : this.lightboxComponyContent }
										</div>
									</div>
								</div>
							</div>
						</LightBox>
					}
				</div>
				}
			</div>
		);
	}
}

export default compose(
	connect(null, { queryViewer, queryViewerFromPro }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(WhoSeeMe);
