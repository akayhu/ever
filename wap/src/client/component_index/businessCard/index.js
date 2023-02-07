import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import Image from 'src/client/component_common/image';
import css from './index.css';
import { Link} from 'react-router';
import clientConfig from "src/configs/client";

class BusinessCard extends Component {
	constructor( props, context ){
		super( props, context );
	}
	render() {
		let completion_percentage = { width: this.props.profile?this.props.profile.completeRate+'%':'0' };

		return (
			this.props.profile && Object.keys(this.props.profile).length > 0 && 
			<div styleName="business_card">
				<div styleName="name_card_img">
					<Image
						type={ 'cover' }
						src={ this.props.profile.coverWebUrl }
					/>
					<div styleName="name_card_black_cloth"></div>
				</div>
				<div styleName="name_card_Information">
					<Link to={`/profile/${this.props.profile.pid}`} data-gtm-avatar="avatar">
						<Image
							type={ 'avatar' }
							src={ this.props.profile.avatarWebUrl }
						/>
					</Link>
					<div className="h3" styleName="name">{ this.props.profile.userName }</div>
					<div className="timestamp" styleName="job_name">
						<div>{ this.props.profile.jobTitle }</div>
						<div>{ this.props.profile.companyName }</div>
					</div>
					<div styleName="business_percentage_block">
						{
							this.props.profile.completeRate <=80 &&
							<div>
								<div styleName="business_main_title">
									<span styleName="business_main_title_left">個人檔案完成度</span>
									<span styleName="business_main_title_right">
										{ this.props.profile.completeRate?this.props.profile.completeRate:0 }%
									</span>
								</div>
								<div styleName="business_percentage">
									<div styleName="business_percentage_main">
										<div styleName="business_percentage_bar" style={ completion_percentage }></div>
									</div>
								</div>
							</div>
						}
					</div>
					{/* <div styleName="business_set_up">
						<div styleName="left">
							<Link to={ `/profile/${this.props.profile.pid}` } data-gtm-index="編輯檔案">
								<i className="edit icon" />編輯檔案
							</Link>
						</div>
						<div styleName="right">
							<Link to={ `/privacy` } data-gtm-index="隱私設定">
								<i className="gear icon" />隱私設定
							</Link>
						</div>
					</div> */}
				</div>
			</div>
		);
	}
}
 
export default compose(
	//connect(mapStateToProps, actions),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(BusinessCard);
