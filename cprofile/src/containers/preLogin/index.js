import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from 'containers/header';
import Footer from 'containers/footer';
import { login } from 'actions/user';
import { menubarClose } from 'actions/ui/menubar';
import { closePreloginService } from 'actions/ui/activationGuide';
import { SubmitButton } from 'share/styledComponents';
import add from './add.png';
import change from './change.png';
import drag from './drag.png';
import frame from './frame.png';
import frameMobile from './frame-mobile.png';
import frameProductManagerMobile from './frame-product-manager-mobile.png';
import frameResumeEngineerMobile from './frame-resume-engineer-mobile.png';
import imageImport from './image-import.png';
import imageShare from './image-share.png';
import layoutResume from './layout_resume.png';
import resumeEngineer from './resume_Engineer.png';
import resumeProductManager from './resume_ProductManager.png';
import shadow from './shadow.png';
import sample1 from './sample-1.png';
import sample2 from './sample-2.png';
import sample3 from './sample-3.png';
import { ModalTitle, ModalButton } from 'share/styledComponents';
import FontIcon from 'material-ui/FontIcon';
import { SectionOne, HomePageImgIn } from './styledComponents';
import './style.css';

class PreLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imgInTopValue: 0,
			sectionValue: 0,
			selectResumeValus: 2,
			imageSrc: layoutResume,
			mobileImageSrc: frameMobile,
			open: true,
		};
		// this.props.menubarClose();
	}

	componentDidMount() {
		window.history.pushState(null, null, '/'); // 網址為原plus其他網址時，讓domain顯示首頁
		// window.addEventListener('scroll', this.onScroll, false);
		// if (!window.brandMechanismCookie) {
		// 	let d = new Date();
		// 	const toNightTime = d.getTime() + getExpireTime();
		// 	d.setTime(d.getTime() + getExpireTime());
		// 	setCookieFunc(
		// 		'brandMechanism',
		// 		d.setTime(toNightTime),
		// 		d.toGMTString(),
		// 		'/'
		// 	);
		// }
	}

	// componentWillUnmount() {
	// 	window.removeEventListener('scroll', this.onScroll, false);
	// }

	_handleStart = () => this.props.history.push('/editor');

	_changeResumeValus = (number, value, mobileValue) => {
		this.setState({
			selectResumeValus: number,
			imageSrc: value,
			mobileImageSrc: mobileValue,
		});
	};

	onScroll = () => {
		if (window.pageYOffset < 1100) {
			this.setState({
				imgInTopValue: window.pageYOffset,
				sectionValue: window.pageYOffset,
			});
		} else {
			this.setState({
				sectionValue: window.pageYOffset,
			});
		}
	};

	handleCancel = () => {
		this.setState({ open: false });
	};

	// Header
	renderHeader = () => {
		const { initial } = this.props.user.toJS();
		return (
			<Header
				fromPrelogin={true}
				mobileLogo={true}
				optionRightList={
					initial ? ['search', 'login'] : ['login']
				}
			/>
		);
	};

	// 下線公告
	renderOfflineAnnouncement = () => {
		return (
			<section class="main_content">
				<div class="title">【104個人檔案服務終止公告】</div>
				<div>
					<p>親愛的會員您好：</p>
					<p>
						誠摯感謝各位會員的支持與鼓勵，<strong>104個人檔案已於2021年12月15日(三)結束服務</strong>，您在<u>104個人檔案</u>內的相關資料，也於服務結束時一併移除，但並不影響使用其他104服務的權益。<u>104個人檔案</u>過去提供的服務，在<a href="https://www.104.com.tw/jobs/main/" target="_blank" title="104人力銀" rel="noreferrer">104人力銀行</a>新版履歷表中已有更豐富、便利的操作體驗，歡迎您盡情展現您的特色與專業。
					</p>
				</div>
			</section>
		);
	};

	// 翻轉履歷
	renderBlock1 = () => {
		const {
			imageSrc,
			selectResumeValus,
			mobileImageSrc,
			sectionValue,
			imgInTopValue,
		} = this.state;
		return (
			<SectionOne sectionValue={sectionValue}>
				<h2>翻轉履歷</h2>
				<p className="title-description">
					《104職涯社群暨個人品牌》服務移轉為《104個人檔案》
					<br />
					提供外包及家教接案使用，打造您亮眼、專業的履歷
				</p>
				<div className="free-to-use">
					<SubmitButton onClick={this._handleStart} title="開始免費使用">
						開始免費使用
					</SubmitButton>
				</div>
				<div className="home-page-div">
					<div className="home-page-img-outer">
						<img src={frame} alt="翻轉履歷" />
					</div>
					<HomePageImgIn
						className="home-page-img-in"
						imgInTopValue={imgInTopValue}
					>
						<img
							src={imageSrc}
							alt="《104職涯社群暨個人品牌》服務移轉為《104個人檔案》提供外包及家教接案使用，打造您亮眼、專業的履歷"
						/>
					</HomePageImgIn>
					<img src={shadow} alt="顛覆你對履歷表的想像" className="shadow-bg" />
					<img
						src={mobileImageSrc}
						className="home-page-img-in-mobile"
						alt="《104職涯社群暨個人品牌》服務移轉為《104個人檔案》提供外包及家教接案使用，打造您亮眼、專業的履歷"
					/>
				</div>
				<div className="resumeButton-div">
					<span
						className={
							selectResumeValus === 1 ? 'resumeButton select' : 'resumeButton'
						}
						onClick={() =>
							this._changeResumeValus(
								1,
								resumeProductManager,
								frameProductManagerMobile
							)
						}
					>
						行銷經理
					</span>
					<span
						className={
							selectResumeValus === 2 ? 'resumeButton select' : 'resumeButton'
						}
						onClick={() =>
							this._changeResumeValus(2, layoutResume, frameMobile)
						}
					>
						設計師
					</span>
					<span
						className={
							selectResumeValus === 3 ? 'resumeButton select' : 'resumeButton'
						}
						onClick={() =>
							this._changeResumeValus(
								3,
								resumeEngineer,
								frameResumeEngineerMobile
							)
						}
					>
						工程師
					</span>
				</div>
			</SectionOne>
		);
	};

	// 展示個人特色
	renderBlock2 = () => (
		<section>
			<div className="dash" />
			<h3>輕易展示個人特色</h3>
			<p className="title-description-two">
				高彈性樣板的設計， 讓你用 3 個步驟就能建立專屬於你的個人頁。​
			</p>
			<div className="free-to-use">
				<SubmitButton onClick={this._handleStart} title="開始免費使用">
					開始免費使用
				</SubmitButton>
			</div>
			<div className="personal-characteristics">
				<div className="personal-characteristics-div">
					<img src={add} alt="輕鬆簡單新增一個區塊" />
					<div className="personal-characteristics-title">
						輕鬆簡單新增一個區塊
					</div>
					<p className="personal-characteristics-description">
						透過簡易的拖放與點擊式操作，即可將資料區塊新增至你的個人頁。​
					</p>
				</div>
				<div className="personal-characteristics-div">
					<img src={change} alt="隨你喜好變換風格" />
					<div className="personal-characteristics-title">隨你喜好變換風格</div>
					<p className="personal-characteristics-description">
						內建多元化的排板樣式，透過左鍵點擊選取就可切換風格。​
					</p>
				</div>
				<div className="personal-characteristics-div">
					<img src={drag} alt="依照需求自訂排序" />
					<div className="personal-characteristics-title">依照需求自訂排序</div>
					<p className="personal-characteristics-description">
						左鍵長按『拖動區塊』按鈕後，就可隨意調整頁面樣板的順序。​
					</p>
				</div>
			</div>
		</section>
	);

	// 一鍵匯入作品集
	renderBlock3 = () => (
		<section>
			<div className="dash" />
			<h3>一鍵匯入作品集</h3>
			<p className="title-description-two">
				收納在GitHub, Behance 的作品集可同步呈現在個人頁，提升曝光機會。​​
			</p>
			<div className="free-to-use">
				<SubmitButton onClick={this._handleStart} title="開始免費使用">
					開始免費使用
				</SubmitButton>
			</div>
			<img src={imageImport} alt="一鍵匯入作品集" />
		</section>
	);

	// 豐富且客製化的樣板
	renderBlock4 = () => (
		<section>
			<div className="dash" />
			<h3>豐富且客製化的樣板</h3>
			<p className="title-description-two">
				多款專業俐落的樣板版型，排版、閱讀都方便​​
			</p>
			<div className="free-to-use">
				<SubmitButton onClick={this._handleStart} title="開始免費使用">
					開始免費使用
				</SubmitButton>
			</div>
			<div className="customized-modules">
				<div>
					<img src={sample1} alt="豐富且客製化的樣板" />
				</div>
				<div>
					<img src={sample2} alt="豐富且客製化的樣板" />
				</div>
				<div>
					<img src={sample3} alt="豐富且客製化的樣板" />
				</div>
			</div>
			<div className="ball-1" />
			<div className="ball-2" />
			<div className="ball-3" />
			<div className="ball-4" />
		</section>
	);

	// 讓專業被更多人看見​
	renderBlock5 = () => (
		<section>
			<div className="seen-by-more-people">
				<div>
					<div className="dash" />
					<h3>讓專業被更多人看見​</h3>
					<p className="title-description-two">
						個人檔案公開發佈後，即可下載 PDF
						檔案或透過連結分享給他人及你的社群平台。​​​
					</p>
					<div className="free-to-use">
						<SubmitButton onClick={this._handleStart} title="開始免費使用">
							開始免費使用
						</SubmitButton>
					</div>
				</div>
				<div>
					<img src={imageShare} alt="讓專業被更多人看見​" />
				</div>
			</div>
		</section>
	);

	renderBlock6 = () => <section />;

	//首頁服務移轉公告
	renderServiceTransfer = () => {
		const { login, showPreloginService, showEditorService } = this.props;

		if (!showPreloginService && !showEditorService) return;
		if (!showPreloginService) return;

		return (
			<div className="modal-upload tag-position prelogin-service">
				<ModalTitle>{`親愛的會員您好： `}</ModalTitle>
				<div
					className="prelogin-service-content"
					dangerouslySetInnerHTML={{
						__html: `感謝您對104職涯社群的支持！
					2019年7月起職涯社群產品轉型改版，關閉社團、頻道服務，強化會員經營個人檔案功能。`,
					}}
				/>
				<ModalButton onClick={login.bind(this, '/editor/loginFromPreLogin')}>
					立即體驗
				</ModalButton>
				<FontIcon
					className="icon-icon_cancel prelogin-service-close"
					onClick={this.props.closePreloginService}
				/>
			</div>
		);
	};

	// 服務公告
	renderAnnouncement = () => {
		const announcementTitle =
			window.announcement_data[0].announcementTitle || '網站公告';
		const announcementContent =
			window.announcement_data[0].announcementContent || '';
		return (
			<div className="modal-upload tag-position prelogin-announcement">
				<ModalTitle>{`${announcementTitle}`}</ModalTitle>
				<div
					className="prelogin-announcement-content"
					dangerouslySetInnerHTML={{ __html: announcementContent }}
				/>
				<ModalButton onClick={this.handleCancel}>關閉</ModalButton>
				<FontIcon
					className="icon-icon_cancel prelogin-announcement-close"
					onClick={this.handleCancel}
				/>
			</div>
		);
	};

	render() {
		const { open } = this.state;
		const show_announcement =
			window.announcement_data[0].showAnnouncement || false;
		return (
			<div className="prelogin-body">
				{this.renderHeader()}
				<article>
					{this.renderOfflineAnnouncement()}
				</article>
				<Footer />
				{show_announcement && open && this.renderAnnouncement()}
			</div>
		);
	}
}

const mapStateToPorps = state => ({
	user: state.get('user'),
	isLogin: state.getIn(['user', 'login']),
	showPreloginService: state.getIn([
		'ui',
		'activationGuide',
		'showPreloginService',
	]),
	showEditorService: state.getIn(['serviceInfo', 'showEditorService']),
});

export default connect(
	mapStateToPorps,
	{ menubarClose, login, closePreloginService }
)(PreLogin);
