import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import BeAGiverNews from './news';
import BeAGiverGiver from './giver';
import BeAGiverTaker from './taker';
import BeAGiverAbout from './about';
import { NEWS_DATA } from './news_data.js';
import { GIVER_DATA } from './giver_data.js';
import { TAKER_DATA } from './taker_data.js';

const getRandomArray = function (minNum, maxNum, n, data) { // 隨機產生不重覆的n個數字
	const rdmArray = [n]; // 儲存產生的陣列
	const rdmNum = [n];  // 儲存產生的亂數
	for (let i = 0; i < n; i++) {
		let rdm = 0; // 暫存的亂數
		do {
			var exist = false; // 此亂數是否已存在
			rdm = getRandom(minNum, maxNum); // 取得亂數
			// 檢查亂數是否存在於陣列中，若存在則繼續回圈
			if (rdmNum.indexOf(rdm) != -1) exist = true;
		} while (exist); // 產生沒出現過的亂數時離開迴圈
		rdmNum[i] = rdm;
		rdmArray[i] = data[rdm];
	}
	return rdmArray;
};

const getRandom = function (minNum, maxNum) { // 取得 minNum(最小值) ~ maxNum(最大值) 之間的亂數
	return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
};

class BeAGiverMainCom extends Component {
	constructor(props) {
		super(props);
		this.state = {
			giverListDatas: [],
			takerListDatas: []
		};
	}
	componentWillMount() {
		const giverLen = GIVER_DATA.length - 1;
		const giverItem = getRandomArray(0, giverLen, 8, GIVER_DATA);
		const takerLen = TAKER_DATA.length - 1;
		const takerItem = getRandomArray(0, takerLen, 8, TAKER_DATA);
		this.setState({
			giverListDatas: giverItem,
			takerListDatas: takerItem
		});
	}
	render() {
		const { giverListDatas, takerListDatas } = this.state;
		return (
			<div>
				<BeAGiverNews newsList={ NEWS_DATA } />
				<BeAGiverGiver giverList={ giverListDatas } />
				<BeAGiverTaker takerList={ takerListDatas } />
				<BeAGiverAbout />
			</div>
		);
	}
}

export default CSSModules(BeAGiverMainCom, css, {allowMultiple: true});
