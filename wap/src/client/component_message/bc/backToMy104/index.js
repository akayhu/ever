import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import clientConfig from 'src/configs/client';


const getRandomArray = function( minNum, maxNum, n ) { // 隨機產生不重覆的n個數字
	var rdmArray = [n]; // 儲存產生的陣列
	for( var i = 0; i < n; i++ ) {
		var rdm = 0; // 暫存的亂數
		do {
			var exist = false; // 此亂數是否已存在
			rdm = getRandom( minNum, maxNum ); // 取得亂數
			// 檢查亂數是否存在於陣列中，若存在則繼續回圈
			if( rdmArray.indexOf( rdm ) != -1 ) exist = true;
		} while ( exist ); // 產生沒出現過的亂數時離開迴圈
		rdmArray[i] = rdm;
	}
	return rdmArray[0] + rdmArray[1] + rdmArray[2] + rdmArray[3] + rdmArray[4] + rdmArray[5];
};
const getRandom = function( minNum, maxNum ) { // 取得 minNum(最小值) ~ maxNum(最大值) 之間的亂數
    return Math.floor( Math.random() * ( maxNum - minNum + 1 ) ) + minNum;
};

const BackToMy104 = ({ jobNo }) =>{
	
	const replyImmediately = (e) => {
		const str = getRandomArray( 1, 100, 6 );
		const url = 'https:' + clientConfig.params.my104Url + '/my104/interview/detail?j=' + jobNo + '&reply=1&u=' + str;
		window.open( url, '_bank' );
	}
	return(
		<div styleName="back_to_my104">
			在你未同意前，企業無法取得聯絡資訊，若你不排斥更好的機會找上你，建議可以與該公司建立聯絡管道。<br/>
			因為您的履歷設定為『開放』（呈現完整履歷）} 。<br/>
			若您要回復企業意願，請至My104會員中心。
			<button className="ui primary button" onClick={replyImmediately}>立即回My104會員中心回覆</button>
		</div>
	);
}
	

export default CSSModules( BackToMy104, css, { allowMultiple: true } )
