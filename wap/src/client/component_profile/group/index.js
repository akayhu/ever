// import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import SocialComponentTitle from 'src/client/component_profile/title/social';
import { GroupCard } from 'src/client/component_common/card';
import { LightBox } from 'c_wap_module';
// import LazyLoading from 'src/client/component_common/lazyLoad/list';
// import Image from 'src/client/component_common/image';
import compose from 'src/util/compose';
// actions
import $ from 'jquery';
// selector
// import { getDataList } from 'src/client/reducers/group/selectors';
// 社團
class Group extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			total: 0,
			offset: 0,
			lightbox: false,
			loading: false
		};
		this.lightboxHandler = this.groupListLightboxHandle.bind(this);
		this.loadMore = this.loadMoreGroupData.bind(this);
	}

	// 先有畫面，之後再搬去reducer控制
	componentDidMount() {
		const url = `/ajax/group/queryMyGroupList?targetPid=${this.props.params.pid}&limit=100&offset=0`;
		$.get(url, (res) => {
			if (res.response) {
				const { dataList, total, offset } = res.response;
				this.setState({ dataList, total, offset });
			}
		});
	}
	loadMoreGroupData() {
		this.state.loadMore = true;
		const url = `/ajax/group/queryMyGroupList?targetPid=${this.props.params.pid}&limit=20&offset=${this.state.offset}`;
		$.get(url, (res) => {
			if (res.response) {
				const { dataList, total, offset } = res.response;
				this.setState({ dataList, total, offset, loading: false });
			}
		});
	}
	// 先有畫面，之後再搬去reducer控制

	groupListLightboxHandle() {
		this.setState({ lightbox: (this.state.lightbox === false) });
	}

	render() {
		const { dataList, total } = this.state;
		const { viewas } = this.props;
		if (total === 0) return false;
		const moreNumber = (viewas === 'self') ?
			<Link to="/group?category=joined">{ total }</Link>
			:
			<span styleName="moreNumber" onClick={ this.lightboxHandler }>{ total }</span>;
		const lightboxObtion = { closeIcon: true,	title: '參加的社團' };
		return (
			<div>
				<SocialComponentTitle
					maintitle="參加的社團"
					privacySettingSwitch={ viewas === 'self' }
					privacyText="group"
					privacy={ this.props.privacy }
					gtmTitleName={ this.props.gtmTitleName }
				/>
				<div className="sub_title" styleName="group_main">
					<dl>
						<dt>已加入 { moreNumber } 個社團</dt>
						{
							dataList && dataList.slice(0, 2).map((item) => {
								return (
									<dd key={ item.id }>
										<GroupCard
											imgSrc={ item.coverWebUrl }
											name={ item.name }
											id={ item.id }
										/>
										<a styleName="left_name" href={ `/group/${item.id}` }>{item.name}</a>
										<span styleName="left_detail">{ item.activityCount } 篇文章</span>
									</dd>
								);
							}
						)
					}
					</dl>
				</div>
				{
					this.state.lightbox &&
					<LightBox
						option={ lightboxObtion }
						clickOverlayToClose
						onClose={ this.lightboxHandler }
					>
						<dl styleName="lightboxListFrame">
							{
								dataList.map((item) => {
									const activityCount = (item.activityCount === 0) ? ' ' : `${item.activityCount}篇文章`;
									return (
										<dd key={ item.id } styleName="lightboxListItem">
											<GroupCard
												imgSrc={ item.coverWebUrl }
												name={ item.name }
												id={ item.id }
												textMode
											/>
											<div styleName="lightbox_detail">{ activityCount }</div>
										</dd>
									);
								})
							}
						</dl>
							{
								this.state.loading &&
								<div className="ui loading" />
							}

					</LightBox>
				}
			</div>
		);
	}
}

export default compose(
	// connect(null, {}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Group);
