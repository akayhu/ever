import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import { LightBox } from 'c_wap_module';

import { NoCountTemplate } from 'src/client/component_common/contactTemplate';
import LazyLoading from 'src/client/component_common/lazyLoad/list';

class Browse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLightbox: false,
			loading: false,
			lightboxTitle: '',
			lightboxItems: [],
			lightboxCount: 0
		};
		this.loadMore = this.loadMore.bind(this);
		this.handleLightBoxCancel = this.handleLightBoxCancel.bind(this);
	}
	loadMore() {
	}
	handleLightbox(index, text, count) {
		if(this.props.user.isLogin === false){
			if(this.props.showHint){
				this.props.showHint();
			}
			
			return false;
		}
		
		this.setState({
			showLightbox: true,
			lightboxTitle: text,
			lightboxItems: this.props.itemData[`${index}List`],
			lightboxCount: count
		});
	}
	handleLightBoxCancel() {
		this.setState({
			showLightbox: false
		});
	}
	render() {
		const { viewCount, likeCount, commentCount, collectCount, endorseCount } = this.props.itemData;
		const { loading, lightboxTitle, showLightbox, lightboxItems, lightboxCount } = this.state;
		const lightboxOption = {
			closeIcon: true,
			title: lightboxTitle
		};
		return (
			<div className="statics_text" styleName="browse">
				<div styleName="left">
					{
						viewCount > 0 &&
						<span>{ viewCount }次瀏覽</span>
					}
				</div>
				<div styleName="right">
					{
						likeCount > 0 &&
						<span onClick={ this.handleLightbox.bind(this, 'like', '說這篇文章酷的人', likeCount) }>
							酷 {likeCount >= 100 ? '99+' : likeCount}
						</span>
					}
					{
						commentCount > 0 &&
						<span onClick={() => this.props.scrollToTarget('comment')} >
							留言 {commentCount >= 100 ? '99+' : commentCount}
							</span>
					}
					{
						collectCount > 0 &&
						<span onClick={ this.handleLightbox.bind(this, 'collect', '收藏這篇文章的人', collectCount) }>
							收藏 {collectCount >= 100 ? '99+' : collectCount}
						</span>
					}
					{
						endorseCount > 0 &&
						<span onClick={ this.handleLightbox.bind(this, 'endorse', '肯定這篇文章的人', endorseCount) }>
							肯定 {endorseCount >= 100 ? '99+' : endorseCount}
						</span>
					}
				</div>
				{
					showLightbox &&
					<LightBox option={ lightboxOption } onClose={ this.handleLightBoxCancel }>
						<LazyLoading loadingAct={ this.loadMore }>
							<div styleName="lbContainer">
								<span>{ lightboxTitle !== '肯定這篇文章的人' && lightboxCount + '個' }{ lightboxTitle }</span>
								{
									lightboxItems && lightboxItems.map((item, key) =>
										<NoCountTemplate
											key={ key }
											pid={ item.userInfo.pid }
											avatarWebUrl={ item.userInfo.userFileUrl }
											name={ item.userInfo.userName }
											company={ item.userInfo.userCompany }
											title={ item.userInfo.userJobTitle }
										/>
									)
								}
								{
									loading &&
									<div style={ {width: '100%', height: '25px', marginBottom: '15px'} }>
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

Browse.defaultProps = {
	canShowLightbox: true
};

Browse.propTypes = {
	canShowLightbox: PropTypes.bool
};

export default compose(
	// connect(null, {}),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Browse);
