import React, { Component } from 'react';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import ProfileCommonBlock from 'src/client/components/profileCommonBlock';

class Honor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: false,
			isShowLayer: false
		};
	}
	componentWillMount() {
		if (this.props.honor.length > 2) {
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
		const dataList = this.state.isShowLayer ? this.props.honor : this.props.honor.slice(0,2);
		return (
			<ProfileCommonBlock handleShowMore={ this.state.showMore } getIsShowLayer={this.getIsShowLayer.bind(this)} gtmName="職涯成就看更多">
				<div styleName="honor">
					<span styleName="title">職涯成就</span>
					<div styleName="container">
						{
							dataList.map((honor) => {
								const { title, description, startTimestamp, endTimestamp, relation } = honor;
								return (
									<div styleName="item">
										<div>
											<span styleName="item_title">
												{ relation ? relation.jobTitle : '' }
											</span>
											<span styleName="gray_color">
												{ moment(startTimestamp).format('YYYY. MM') }
												~
												{ moment(endTimestamp).format('YYYY. MM') }
											</span>
										</div>
										<p styleName="bold">{ relation ? relation.companyName : '' }</p>
										<p styleName="bold">{ title }</p>
										<p styleName="gray_color">{ description }</p>
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
)(Honor);
