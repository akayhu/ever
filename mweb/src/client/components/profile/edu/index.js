import React, { Component } from 'react';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import ProfileCommonBlock from 'src/client/components/profileCommonBlock';

class Edu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: false,
			isShowLayer: false
		};
	}
	componentWillMount() {
		if (this.props.edu.length > 2) {
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
		const dataList = this.state.isShowLayer ? this.props.edu : this.props.edu.slice(0,2);
		return (
			<ProfileCommonBlock handleShowMore={ this.state.showMore } getIsShowLayer={this.getIsShowLayer.bind(this)} gtmName="學歷看更多">
				<div styleName="edu">
					<span styleName="title">學歷</span>
					<div styleName="container">
						{
							dataList.map((edu) => {
								const { schoolName, major, startTimestamp, endTimestamp, degreeDesc, degreeStatusDesc } = edu;
								let dateStr = null;
								
								if(endTimestamp){
									dateStr = ' ~ '+moment(endTimestamp).format('YYYY. MM');
								}
								
								return (
									<div styleName="item">
										<ul>
											<li>
												<span styleName="item_title">
													{ schoolName }
												</span>
												<span styleName="gray_color">
													{ moment(startTimestamp).format('YYYY. MM') + dateStr }
												</span>
											</li>
											<li>
												<span styleName="item_title">
													{ major }
												</span>
												<span styleName="gray_color">
													{ degreeDesc }{ degreeStatusDesc }
												</span>
											</li>
										</ul>
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
)(Edu);
