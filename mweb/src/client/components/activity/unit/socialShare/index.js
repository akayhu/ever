import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import clientConfig from 'src/configs/client';

const SocialShare = ({mode, itemData, user}) => {
	return (
		<div styleName="social_share">
			<a href={`//line.naver.jp/R/msg/text/?${itemData.title}%20%7C%20104%20職涯社群%20-%20https:${clientConfig.params.wapUrl}/m/activity/${itemData.aid}`} target="_blank">
				<img src={ `${clientConfig.params.staticMWapUrl}/img/icon/line.png` } data-gtm-activity="分享 - Line" />
			</a>
			<a href={`//www.facebook.com/sharer.php?u=https:${clientConfig.params.wapUrl}/m/activity/${itemData.aid}&t=${itemData.title}`} target="_blank">
				<img src={ `${clientConfig.params.staticMWapUrl}/img/icon/fb.png` } data-gtm-activity="分享 - FB" />
			</a>
			<a href={`//plus.google.com/share?url=https:${clientConfig.params.wapUrl}/m/activity/${itemData.aid}`} target="_blank">
				<img src={ `${clientConfig.params.staticMWapUrl}/img/icon/google.png` } data-gtm-activity="分享 - G+" />
			</a>
			<a href={`mailto:?subject=${itemData.title}&body=${user.userName}從 104職涯社群 推薦了一篇文章給你「${itemData.title}」%0D%0Ahttps:${clientConfig.params.wapUrl}/m/activity/${itemData.aid}%0D%0A%0D%0A%0D%0A%0D%0Afrom 104職涯社群  http://plus.104.com.tw/m`}>
				<img src={ `${clientConfig.params.staticMWapUrl}/img/icon/mail.png` } data-gtm-activity="分享 - Email" />
			</a>
		</div>
	);
};
export default CSSModules(SocialShare, css);
