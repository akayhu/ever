import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class BeAGiverAbout extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div styleName="about_giver">
				<h2>關於 Be A Giver</h2>
				<p styleName="about_first">
					不論哪個年代，媒體總是重複報導著對年輕人的批判、年輕人的無助，這一點意義也沒有，如果少了前輩出面當 Giver，後輩如何當 Braver？ 與其謾罵批判，何不多做點事情一起來改變現狀？
				</p>
				<p>
					國內15~24歲青年失業率已連續7年超過12%，實質平均薪資倒退16年，企業抱怨找不到好人才，面對多年既存的社會問題，<a href="http://corp.104.com.tw/index3151.html" target="_blank"> 104 希望基金會</a>執行長黃于純說，謾罵和抱怨顯得多餘而無效，台灣需要一場以幫助為名的社會運動，「Be A Giver」，能者前輩挺身當 Giver， 讓後進有典範可學習。
				</p>
				<p>
					Giver 是「給予者」，包括職場前輩、技藝專業、導師教練等，舉凡能將專業技術或知識態度傳承給他人皆可稱為Giver，接受傳承的另一方則為Taker「接受者」。
				</p>
				<p>
					<a href="http://corp.104.com.tw/index3151.html" target="_blank"> 104 希望基金會</a>發起「 Be A Giver」運動，號召各行各業前輩站出來，對 Taker 傳承專業技藝與人生態度。當 Giver 與 Taker 相遇， 美好的交流學習將讓知識技藝得以傳承；當您幫助別人，也正幫助自己體現共生共榮的美好價值。
				</p>
			</div>
		);
	}
}

export default CSSModules(BeAGiverAbout, css, {allowMultiple: true});
