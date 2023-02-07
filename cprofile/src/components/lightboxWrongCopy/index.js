import React from 'react';
import wrongCopyImg from 'components/defaultSmallImage/error.png';
import './style.scss';

const LightboxWrongCopy = props => (
	<div className="wrong-copy-main">
		<img src={wrongCopyImg} alt="錯誤" />
		<h3>唔，資料處理需要花一些時間...</h3>
		<p dangerouslySetInnerHTML={{ __html: props.text }} />
	</div>
);

export default LightboxWrongCopy;
