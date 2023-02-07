import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// components
import Layer from 'src/client/components/layer';
import ShowMore from './showMore';

class ProfileCommonBlock extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShow: false,
		};
	}
	handelShowLayer(value) {
		const { getIsShowLayer } = this.props;
		if (getIsShowLayer) getIsShowLayer(value);
		this.setState({
			isShow: value,
		});
	}
	render() {
		const { handleShowMore, children, gtmName } = this.props;
		/*
			外層overflow hidden是拿來把過長的資訊縮起來
			在外層時無法使用layer是否開啟來做overflow的關閉
			在進入看更多時則就全部展開，所以將overflow設為initial
		*/
		const childAddStyle = React.cloneElement(children, {style: {overflow: 'initial'}});
		return (
			<div>
				{ children }
				{	handleShowMore &&
					<ShowMore handelShowLayer={ this.handelShowLayer.bind(this, true) } gtmName={ gtmName } />
				}
				<Layer
					backBtnText={this.props.backBtnText || "個人檔案"}
					open={ this.state.isShow }
					onRequestClose={ this.handelShowLayer.bind(this) }
				>
					{ childAddStyle }
				</Layer>
			</div>
		);
	}
}

export default compose(
	[CSSModules, '_', css, { allowMultiple: true }],
)(ProfileCommonBlock);
