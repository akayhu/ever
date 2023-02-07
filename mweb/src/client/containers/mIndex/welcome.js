import React from 'react';
import clientConfig from 'src/configs/client';

// plusMobileHomeEvent_Data 與 plusMobileHomeEventMovie_Data 資料位置：//static.104.com.tw/plus/js/announcementContent.js

class Welcome extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<main>
				<article>
					<section id="workplace">
						<h2>活動講座</h2>
						<dl>
							<dd>
								<a
									href={ `${clientConfig.params.wapUrl}/activity/ba0d304b-9442-403f-9686-2e800e0c22d0` }
									target="_blank"
									rel="noopener noreferrer"
									title="轉職大冒險：給想進外商 & 大企業的你"
								>
									<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_kv.png` } alt="轉職大冒險：給想進外商 & 大企業的你" />
								</a>
								<div className="content list">
									<div className="title">【近期活動】</div>
									{
										window.plusMobileHomeEvent_Data.map(elem => (
											<a
												href={ elem.href }
												target="_blank"
												rel="noopener noreferrer"
												title={ elem.title }
												className="workplace_content_link"
												key={ elem.id }
											>
												<h4>{ elem.title }</h4>
											</a>
										))
									}
								</div>
								<div className="content list">
									<div className="title">【講座影片】</div>
									{
										window.plusMobileHomeEventMovie_Data.map(elem => (
											<a
												href={ elem.href }
												target="_blank"
												rel="noopener noreferrer"
												title={ elem.title }
												className="workplace_content_link"
												key={ elem.id }
											>
												<h4>{ elem.title }</h4>
											</a>
										))
									}
								</div>
							</dd>
						</dl>
					</section>
					<section id="beagiver">
						<h2>精選文章</h2>
						<div className="content">
							<div className="Logo">
								<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_article.png` } alt="BeAGiver" className="bg" />
							</div>
							<div id="article">
								{
									window.plusMobileHomeActivity_Data.map(elem => (
										<a
											href={ elem.href }
											key={ elem.id }
											target="_blank"
											rel="noopener noreferrer"
											title={ elem.title }
											className="workplace_content_link"
										>
											<h4>{ elem.title }</h4>
										</a>
									))
								}
							</div>
						</div>
					</section>
					<section id="group">
						<h2>推薦頻道與社團</h2>
						<div className="content" id="group_slider">
							<ul>
								<li className="group_show">
									<a
										href={ `${clientConfig.params.wapUrl}/group/18951` }
										target="_blank"
										rel="noopener noreferrer"
										title="上班族工作百味"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_group_18951.png` } alt="上班族工作百味" />
									</a>
									<div className="group_join_bg">
										<h3>上班族工作百味</h3>
									</div>
									<div className="group_content">
										<p>其實你不孤單，因為我們一直都在！快來交流分享，尋找職涯新方向。</p>
										<a
											href="/sso/saml-login"
											target="_blank"
											rel="noopener noreferrer"
											title="加入社團"
										>
											加入社團
										</a>
									</div>
								</li>
								<li className="group_show">
									<a
										href={ `${clientConfig.params.wapUrl}/group/44825` }
										target="_blank"
										rel="noopener noreferrer"
										title="上班族法令"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_group_44825.png` } alt="上班族法令" />
									</a>
									<div className="group_join_bg">
										<h3>上班族法令</h3>
									</div>
									<div className="group_content">
										<p>職場生存必備！第一手掌握勞動法令，教你維護自身工作權益。</p>
										<a
											href="/sso/saml-login"
											target="_blank"
											rel="noopener noreferrer"
											title="加入社團"
										>
											加入社團
										</a>
									</div>
								</li>
								<li className="group_show">
									<a
										href={ `${clientConfig.params.wapUrl}/group/13545` }
										target="_blank"
										rel="noopener noreferrer"
										title="人資同學會"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_group_13545.png` } alt="人資同學會" />
									</a>
									<div className="group_join_bg">
										<h3>人資同學會</h3>
									</div>
									<div className="group_content">
										<p>在人資領域工作的夥伴，歡迎來找專業、長知識、學智慧、交朋友。</p>
										<a
											href="/sso/saml-login"
											target="_blank"
											rel="noopener noreferrer"
											title="加入社團"
										>
											加入社團
										</a>
									</div>
								</li>
								<li className="group_show">
									<a
										href={ `${clientConfig.params.wapUrl}/channel/60129` }
										target="_blank"
										rel="noopener noreferrer"
										title="職場360"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_group_60129.png` } alt="職場360" />
									</a>
									<div className="group_join_bg">
										<h3>職場360</h3>
									</div>
									<div className="group_content">
										<p>職場趨勢搶先看！104提供你全方位行業資訊，助你洞察市場先機。</p>
										<a
											href="/sso/saml-login"
											target="_blank"
											rel="noopener noreferrer"
											title="關注頻道"
										>
											關注頻道
										</a>
									</div>
								</li>
								<li className="group_show">
									<a
										href={ `${clientConfig.params.wapUrl}/channel/60308` }
										target="_blank"
										rel="noopener noreferrer"
										title="CJC設計實驗室"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_group_60287.png` } alt="CJC設計實驗室" />
									</a>
									<div className="group_join_bg">
										<h3>CJC設計實驗室</h3>
									</div>
									<div className="group_content">
										<p>充滿創意與熱情的秘密基地，一起動腦思考，探索無限想像空間。</p>
										<a
											href="/sso/saml-login"
											target="_blank"
											rel="noopener noreferrer"
											title="關注頻道"
										>
											關注頻道
										</a>
									</div>
								</li>
							</ul>
						</div>
					</section>
					<section id="about">
						<h2>關於職涯社群</h2>
						<div className="content">
							<div className="appLogo">
								<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_app_plus.png` } alt="104職涯社群" title="104職涯社群" />
							</div>
							<h3>專屬於你的職涯管理工具</h3>
							<ul className="word">
								<li><p>104 職涯社群每周舉辦免費活動講座，邀請業界職人分享各行各業職務生態，讓你以學習連結職場脈動，並與其它業界同好相互交流。</p></li>
								<li><p>透過104 職涯社群APP，掌握報名最新活動資訊、管理學習記錄、並可透過APP在講座現場與其它參與者互動，打造你的職場競爭力，拓展你的專業人脈，一起打造你的職涯新未來。</p></li>
							</ul>
							<ul className="appLogo">
								<li>
									<a
										href="//itunes.apple.com/tw/app/104+/id770520900?mt=8"
										target="_blank"
										rel="noopener noreferrer"
										title="App Store 下載"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_app_download_apple.png` } alt="App Store 下載" />
									</a>
								</li>
								<li>
									<a
										href="//play.google.com/store/apps/details?id=com.m104plus"
										target="_blank"
										rel="noopener noreferrer"
										title="Google Play 下載"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_app_download_google.png` } alt="Google Play 下載" />
									</a>
								</li>
								<li>
									<a
										href="//www.facebook.com/plus104/?fref=ts"
										target="_blank"
										rel="noopener noreferrer"
										title="FaceBook"
									>
										<img src={ `${clientConfig.params.staticMWapUrl}/img/welcome834/img_fb.png` } alt="FaceBook粉絲團" />
									</a>
								</li>
							</ul>
						</div>
					</section>
				</article>
				<footer>一零四資訊科技股份有限公司</footer>
				<noscript>
					<img
						src="//d5nxst8fruw4z.cloudfront.net/atrk.gif?account=lRlHh1awVK00wf"
						style={ { display: 'none' } }
						height="1"
						width="1"
					/>
				</noscript>
			</main>
		);
	}
}

export default Welcome;
