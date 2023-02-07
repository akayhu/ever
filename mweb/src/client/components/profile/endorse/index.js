import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import Layer from 'src/client/components/layer';
import ShowMore from 'src/client/components/profileCommonBlock/showMore';
import PeopleItem from 'src/client/components/peopleItem';

class Endorse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showMore: false,
			isShowAll: false,
			isShowSingle: false,
			singleLayerBackText: '',
			layerIndex: 0,
		};
		this.renderAllData = this.renderAllData.bind(this);
		this.renderSingleData = this.renderSingleData.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.endorse.dataList.length > 5) {
			this.setState({
				showMore: true,
			});
		}
	}
	renderAllData(backText) {
		return (
			<div>
				<span styleName="title">專長特質與證照</span>
				<div styleName="container">
					<ul>
						{
							this.props.endorse.dataList.map((data, index) => (
								<li
									styleName="item"
									onClick={ this.handelShowSingleDataLayer.bind(this, true, index, backText) }
								>
									<span styleName="item_title">{ data.item }</span>
									<i className="detail outline icon" />
									<div styleName="right_section">
										<a href="javascript: void(0);">{ data.srcUserInfo.length }</a>
										{ // 最多顯示三筆
											data.srcUserInfo.slice(0, 2).map(user => (
												<PeopleItem
													userObj={ user }
													onlyImg={ true }
													imgSize={ 30 }
													imgStyle={ {marginLeft: '8px'} }
													wrapStyle={ {padding: 0} }
												/>
											))
										}
									</div>
								</li>
							))
						}
					</ul>
				</div>
			</div>
		);
	}
	renderSingleData() {
		const data = this.props.endorse.dataList[this.state.layerIndex];
		return (
			<div>
				<div styleName="endorse_single">
					<span styleName="title">{ data.item }({ data.srcUserInfo.length })</span>
					{
						data.desc &&
						<p styleName="desc">
							{ data.desc }
						</p>
					}
				</div>
				<div>
					{
						data.srcUserInfo.map(user => (
							<PeopleItem
								userObj={ user }
							/>
						))
					}
				</div>
			</div>
		);
	}
	handelShowSingleDataLayer(value, index = 0, backText = '') {
		this.setState({
			isShowSingle: value,
			singleLayerBackText: backText,
			layerIndex: index,
		});
	}
	handelShowAllDataLayer(value) {
		this.setState({
			isShowAll: value,
		});
	}
	handle
	render() {
		const { showMore, singleLayerBackText, isShowSingle, isShowAll } = this.state;
		return (
			<div>
				<div styleName={ showMore ? 'show_more' : '' }>
					{ this.renderAllData('個人檔案') }
				</div>
				{
					showMore &&
						<ShowMore handelShowLayer={ this.handelShowAllDataLayer.bind(this, true) } gtmName="專長與證照看更多" />
				}
				<Layer
					backBtnText={ singleLayerBackText }
					open={ isShowSingle }
					onRequestClose={ this.handelShowSingleDataLayer.bind(this) }
					bodyStyle={ { padding: 0 } }
					style={ isShowSingle ? { zIndex: 9 } : {} }
				>
					{
						isShowSingle &&
						this.renderSingleData()
					}
				</Layer>
				<Layer
					backBtnText="個人檔案"
					open={ isShowAll }
					onRequestClose={ this.handelShowAllDataLayer.bind(this) }
				>
					{ this.renderAllData('專長特質與證照') }
				</Layer>
			</div>
		);
	}
}

export default compose(
	[CSSModules, '_', css, { allowMultiple: true }],
)(Endorse);
