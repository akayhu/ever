import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import BeAGiverPeople from './mainPeople';

class BeAGiverTaker extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { takerList } = this.props;
		return (
			<div styleName="taker_giver">
				<h2>Taker 等你提攜</h2>
				{/*
				<div styleName="number_giver">(911位)</div>
				*/}
				<BeAGiverPeople 
					describe="想學：" 
					linkName="Taker" 
					dataGtm="最新動態-Taker Activity" 
					peopelItems={ takerList } 
				/>
				<div styleName="button">
					<a 
						data-gtm-giver="最新動態-Taker 加入我們" 
						styleName="join" 
						href="https://104executive.com.tw" 
						target="_blank"
					>
						我要成為Taker
					</a>
				</div>
			</div>
		);
	}
}

export default CSSModules(BeAGiverTaker, css, {allowMultiple: true});
