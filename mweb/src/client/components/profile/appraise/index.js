import React, { Component } from 'react';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import ProfileCommonBlock from 'src/client/components/profileCommonBlock';

class Appraise extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: false,
			isShowLayer: false,
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.appraise.dataList.length > 2) {
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
		const dataList = this.state.isShowLayer ? this.props.appraise.dataList : this.props.appraise.dataList.slice(0,2);
		return (
			<ProfileCommonBlock handleShowMore={ this.state.showMore } getIsShowLayer={this.getIsShowLayer.bind(this)} gtmName="讚美看更多">
				<div styleName="appraise">
					<span styleName="title">他人的讚美</span>
					<div styleName="container">
						{
							dataList.map((appraise) => {
								const { userName, jobTitle, text } = appraise;
								return (
									<div styleName="item">
										<p styleName="bold">{ userName }</p>
										<p styleName="bold">{ jobTitle }</p>
										<p styleName="gray_color">{ text }</p>
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
)(Appraise);
