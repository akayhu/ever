import React, { Component } from 'react';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import ProfileCommonBlock from 'src/client/components/profileCommonBlock';

class Exp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: false,
			isShowLayer: false
		};
	}
	componentWillMount() {
		if (this.props.exp.length > 2) {
			this.setState({
				showMore: true,
			});
		}
	}
	getIsShowLayer(value) {
		this.setState({
			isShowLayer: value
		});
	}
	render() {
		const dataList = this.state.isShowLayer ? this.props.exp : this.props.exp.slice(0,2);
		
		return (
			<ProfileCommonBlock handleShowMore={ this.state.showMore } getIsShowLayer={this.getIsShowLayer.bind(this)} gtmName="經歷看更多">
				<div styleName="exp">
					<span styleName="title">經歷</span>
					<div styleName="container">
						{
							dataList.map((exp) => {
								const { jobTitle, startTimestamp, endTimestamp, stillWork, companyName, jobNote, expAreaDesc } = exp;
								let dateStr = null;
								
								if(startTimestamp && stillWork){
									dateStr = ' ~ 至今';
								}else if(startTimestamp && endTimestamp){
									dateStr = ' ~ '+moment(endTimestamp).format('YYYY. MM');
								}
								
								return (
									<div styleName="item">
										<div>
											<span styleName="item_title">
												{jobTitle}
											</span>
											<span styleName="gray_color">
												{
													stillWork
													? '(最近一筆) '
													: ''
												}
												{ 
													startTimestamp && (moment(startTimestamp).format('YYYY. MM') + dateStr)
												}
											</span>
										</div>
										<p styleName="bold">{companyName}</p>
										<p>{jobNote}</p>
										<p styleName="gray_color">{expAreaDesc}</p>
									</div>
								);
							})
						}
					</div>
				</div>
			</ProfileCommonBlock>
		);
	}
}


export default compose(
	[CSSModules, '_', css, { allowMultiple: true }],
)(Exp);
