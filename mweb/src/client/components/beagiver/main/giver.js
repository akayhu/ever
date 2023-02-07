import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import BeAGiverPeople from './mainPeople';

class BeAGiverGiver extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { giverList } = this.props;
		return (
			<div styleName="giver_giver">
				<h2>Giver 挺身而出</h2>
				{/*
				<div styleName="number_giver">(518位)</div>
				*/}
				<BeAGiverPeople 
					describe="擅長：" 
					linkName="Giver" 
					dataGtm="最新動態-Giver Activity" 
					peopelItems={ giverList } 
				/>
				<div styleName="button">
					<a 
						data-gtm-giver="最新動態-Giver 加入我們" 
						styleName="join" href="https://104executive.com.tw" 
						target="_blank"
					>
						我要成為Giver
					</a>
				</div>
			</div>
		);
	}
}

export default CSSModules(BeAGiverGiver, css, {allowMultiple: true});
