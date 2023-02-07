import React, { Component, Fragment } from 'react';
import DOMPurify from 'dompurify';
import { Record } from 'immutable';
import { connect } from 'react-redux';
import Import from './import';
import Publish from './publish';
import AccountMenu from './account';
import logo from 'components/defaultSmallImage/logo.png';
import { menubarOpen, menubarClose, themeOpen } from 'actions/ui/menubar';
import { SubmitButtonSmallSquare } from 'share/styledComponents';
import { login } from 'actions/user';
import { Menu, Dropdown, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import { submitSearchQuery, clearPreviousSearch } from 'actions/profile';
import { BrowserView, MobileView } from 'react-device-detect';
import { stateMachineTransition } from 'actions/ui/statemachine';
import {
	profileDrawerClose,
	profileDrawerOpen,
} from 'actions/ui/profileDrawer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
	Container,
	Content,
	Logo,
	ContentMobile,
	LoginButton,
	ContentMain,
	ContentItem,
	ContentItemContent,
	OptionLine,
	Preview,
	ToolBox,
	ToolItem,
	SearchBar,
} from './styledComponents';
import './style.scss';

class Header extends Component {
	constructor(props) {
		super(props);
		this.previewMenu = (
			<Menu>
				<Menu.Item key="1">
					<span onClick={this._handleHistoryPreview.bind(this, 'web')}>
						瀏覽器預覽
					</span>
				</Menu.Item>
				<Menu.Item key="2">
					<span onClick={this._handleHistoryPreview.bind(this, 'paper')}>
						紙張預覽
					</span>
				</Menu.Item>
				<Menu.Item key="3">
					<span onClick={this._handleHistoryPreview.bind(this, 'tablet')}>
						平板預覽
					</span>
				</Menu.Item>
				<Menu.Item key="4">
					<span onClick={this._handleHistoryPreview.bind(this, 'mobile')}>
						手機預覽
					</span>
				</Menu.Item>
				<Menu.Item key="5">
					<span onClick={this._handleHistoryPreview.bind(this, 'businessCard')}>
						名片預覽
					</span>
				</Menu.Item>
			</Menu>
		);
		this.previewMobileMenu = (
			<Menu>
				<Menu.Item key="1">
					<span onClick={this._handleHistoryPreview.bind(this, 'web')}>
						瀏覽器預覽
					</span>
				</Menu.Item>
				{/* <Menu.Item key="2">
					<span onClick={ this._handleHistoryPreview.bind(this, 'paper') }>紙張預覽</span>
				</Menu.Item> */}
				<Menu.Item key="3">
					<span onClick={this._handleHistoryPreview.bind(this, 'businessCard')}>
						名片預覽
					</span>
				</Menu.Item>
			</Menu>
		);
	}

	testPDFFunc = () => {
		window.html2canvas = html2canvas;
		setTimeout(() => {
			const printId = document.getElementById(
				'preview-desk-paint-paper-wrapper'
			);
			html2canvas(printId, {
				foreignObjectRendering: true,
				useCORS: true,
				allowTaint: true,
			}).then(canvas => {
				const contentWidth = canvas.width;
				const contentHeight = canvas.height;
				// 頁面偏移
				let position = 0;
				// 一頁pdf顯示html頁面生成的canvas高度;
				const pageHeight = (contentWidth / 592.28) * 841.89;
				// 未生成pdf的html頁面高度
				let leftHeight = contentHeight;
				// A4紙的尺寸[595.28,841.89]，html頁面生成的canvas在pdf中圖片的寬高
				const imgWidth = 595.28;
				const imgHeight = (592.28 / contentWidth) * contentHeight;
				const pageData = canvas.toDataURL('image/jpeg', 1);
				const pdf = new jsPDF('', 'pt', 'a4');
				// pdf.addHTML(printId, {
				// 	pagesplit: true,
				// }, () => {
				// 	pdf.save("download.pdf");
				// });
				if (leftHeight < pageHeight) {
					pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
				} else {
					while (leftHeight > 0) {
						pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
						leftHeight -= pageHeight;
						position -= 841.89;
						// 避免添加空白頁
						if (leftHeight > 0) {
							pdf.addPage();
						}
					}
				}
				let pdfWindow = window.open('');
				pdfWindow.document.write(
					"<embed border='0' width='100%' height='100%' src='" +
						pdf.output('datauristring') +
						"'></embed>"
				);
			});
		}, 500);
	};

	componentDidUpdate = () => {
		if (this.nameInput && this.props.searchValue) {
			// focus input 並游標在結尾
			let value = this.props.searchValue;
			this.nameInput.value = '';
			this.nameInput.value = value;
			this.nameInput.focus();
		}
	};

	_handleHistoryPreview = name => {
		this.props.history.push(`/preview/${name}`);
	};

	handleToggle = () => {
		if (this.props.preview === true) {
			this.props.history.push('/editor');
			this.props.menubarOpen();
		} else {
			const { visible } = this.props;
			visible ? this.props.menubarClose() : this.props.menubarOpen();
		}
	};

	handleToggleTheme = () => {
		const { theme } = this.props;
		theme ? this.props.menubarClose() : this.props.themeOpen();
	};

	_handlePrintEnd = () => {
		this.props.printEnd();
	};

	_handleSearch = () => {
		this.props.history.push(`/search`);
	};

	_handleSearchSubmit = (trigger = 'click', e) => {
		if (trigger === 'click' || (trigger === 'keyboard' && e.keyCode === 13)) {
			e.preventDefault();
			const keyword = DOMPurify.sanitize(this.nameInput.value, {
				ALLOWED_TAGS: [],
				KEEP_CONTENT: true,
			});
			this.props.clearPreviousSearch();
			this.props.submitSearchQuery(keyword);
			this.props.history.push(`/search?q=${keyword}`);
		}
	};

	_handleComeBackEdit = () => {
		this.props.menubarOpen();
		this.props.history.push('/editor');
	};

	_renderDropdownPreview = () => {
		const { match } = this.props;
		let previewTagName;

		if (match) {
			switch (match.params.previewName) {
				case 'paper':
					previewTagName = '紙張預覽';
					break;
				case 'web':
					previewTagName = '瀏覽器預覽';
					break;
				case 'tablet':
					previewTagName = '平板預覽';
					break;
				case 'mobile':
					previewTagName = '手機預覽';
					break;
				case 'businessCard':
					previewTagName = '名片預覽';
					break;
				default:
					previewTagName = '預覽';
					break;
			}
		} else {
			previewTagName = '預覽';
		}

		return (
			<Preview>
				{/* 桌機版 */}
				<BrowserView>
					<Dropdown overlay={this.previewMenu}>
						<span>
							{previewTagName} <Icon type="down" />
						</span>
					</Dropdown>
				</BrowserView>

				{/* 平板＆手機板 */}
				<MobileView>
					<Dropdown overlay={this.previewMobileMenu} trigger={['click']}>
						<span>
							{previewTagName} <Icon type="down" />
						</span>
					</Dropdown>
				</MobileView>
			</Preview>
		);
	};

	_renderSearchBar = device => {
		return (
			<SearchBar key="searchBar" device={device}>
				<input
					type="text"
					defaultValue={this.props.searchValue}
					placeholder="搜尋職稱、科系、技能名稱..."
					ref={input => {
						this.nameInput = input;
					}}
					onKeyDown={this._handleSearchSubmit.bind(this, 'keyboard')}
				/>
				<button
					type="submit"
					onClick={this._handleSearchSubmit.bind(this, 'click')}
				>
					<Icon type="search" theme="outlined" />
				</button>
			</SearchBar>
		);
	};

	_renderToolBox = (optionList = []) => {
		const {
			visible,
			preview,
			searchIndex,
			initial,
			printData,
			profileDrawerClose,
			profileDrawerOpen,
			history,
		} = this.props;
		// header 工具列按鈕清單
		const toolItemMap = Record({
			// 模組
			template: (
				<ContentItem
					key="template"
					select={visible}
					onClick={this.handleToggle}
				>
					<ContentItemContent>樣板</ContentItemContent>
				</ContentItem>
			),
			// 下載
			download: (
				<ToolItem key="download">
					<ReactToPrint
						trigger={() => <span>下載</span>}
						content={() => printData}
						onBeforePrint={() => profileDrawerClose()}
						onAfterPrint={() => profileDrawerOpen()}
						closeAfterPrint={true}
					/>
				</ToolItem>
			),
			// 編輯(按鈕)
			edit: (
				<span
					key="edit"
					style={{ display: 'inline-block', margin: '8px 15px 0 0' }}
				>
					<SubmitButtonSmallSquare
						onClick={() => history.push('/editor')}
						id="index_editor_button"
					>
						{initial ? '編輯我的檔案' : '創建我的檔案'}
					</SubmitButtonSmallSquare>
				</span>
			),
			// 返回編輯
			comeBackEdit: (
				<ContentItem key="comeBackEdit">
					<ContentItemContent onClick={this._handleComeBackEdit}>
						返回編輯
					</ContentItemContent>
				</ContentItem>
			),
			// 預覽
			preview: (
				<ContentItem key="preview" select={preview}>
					{this._renderDropdownPreview()}
				</ContentItem>
			),
			// 登入
			login: (
				<ToolItem key="login">
					<AccountMenu />
				</ToolItem>
			),
			// 匯入資料
			importData: (
				<ContentItem key="importData">
					<Import />
				</ContentItem>
			),
			// 發佈
			publish: <Publish key="publish" />,
			// 搜尋檔案
			search: (
				<Fragment key="search">
					{searchIndex && initial && (
						<Fragment>
							<OptionLine />
							<ContentItem select={true} onClick={this._handleSearch}>
								<ContentItemContent>瞧瞧別人</ContentItemContent>
							</ContentItem>
						</Fragment>
					)}
					{!searchIndex && initial && (
						<ToolItem onClick={this._handleSearch}>瞧瞧別人</ToolItem>
					)}
				</Fragment>
			),
			// 搜尋Bar
			searchBar: (
				<Fragment key="searchBar">
					<BrowserView>{this._renderSearchBar()}</BrowserView>
					<MobileView>{this._renderSearchBar('mobile')}</MobileView>
				</Fragment>
			),
			// 間隔線
			spacer: <OptionLine key="spacer" />,
			// 間隔線(為了mobile key不重複的短解)
			spacer_1: <OptionLine key="spacer_1" />,
		})();

		return optionList
			.filter(name => toolItemMap.has(name))
			.map(name => toolItemMap.get(name));
	};

	_renderMobileView = () => {
		const { optionLeftList, mobileLogo } = this.props;
		return (
			<Container>
				<ContentMobile>
					{mobileLogo && (
						<div>
							<Link to="/">
								<Logo>
									<img src={logo} alt="104_logo" className="logo" />
								</Logo>
							</Link>
						</div>
					)}
					{optionLeftList && (
						<ContentMain>{this._renderToolBox(optionLeftList)}</ContentMain>
					)}
					<ToolItem>
						<AccountMenu />
					</ToolItem>
				</ContentMobile>
			</Container>
		);
	};

	_renderBrowserView = () => {
		const { optionLeftList, optionRightList } = this.props;
		return (
			<Container>
				<Content>
					<Link to="/">
						<Logo>
							<img src={logo} alt="104_logo" className="logo" />
						</Logo>
					</Link>
					{optionLeftList && (
						<ContentMain>{this._renderToolBox(optionLeftList)}</ContentMain>
					)}
				</Content>
				{optionRightList && (
					<ToolBox>{this._renderToolBox(optionRightList)}</ToolBox>
				)}
			</Container>
		);
	};

	render() {
		const { isLogin, initial, login, plusMode, fromPrelogin } = this.props;
		if (plusMode) {
			return (
				<Container>
					<div style={{ margin: '0 auto', paddingTop: '10px' }}>
						<a
							href="https://plus.104.com.tw/articles/"
							target="_blank"
							rel="noopener noreferrer"
							title="104個人檔案"
						>
							<img
								src="https://static.104.com.tw/logo/104logo_plus_180x26.png"
								width="161"
								alt="104_logo"
							/>
						</a>
					</div>
				</Container>
			);
		}

		if (!isLogin) {
			return (
				<Container>
					<Content>
						<Link to="/">
							<Logo>
								<img src={logo} alt="104_logo" className="logo" />
							</Logo>
						</Link>
					</Content>
					{/* {!initial && (
						<LoginButton
							onClick={login.bind(
								this,
								`/editor${fromPrelogin ? '/loginFromPreLogin' : ''}`
							)}
							id="index_login_link"
						>
							登入
						</LoginButton>
					)} */}
				</Container>
			);
		}

		return (
			<Fragment>
				{/* 桌機版 */}
				<BrowserView>{this._renderBrowserView()}</BrowserView>

				{/* 平板＆手機板 */}
				<MobileView>{this._renderMobileView()}</MobileView>
			</Fragment>
		);
	}
}

const matStateToProps = (state, props) => ({
	pid: state.getIn(['user', 'pid']),
	isLogin: state.getIn(['user', 'login']),
	visible: state.getIn(['ui', 'menubar', 'visible']),
	preview: state.getIn(['ui', 'menubar', 'preview']),
	printData: state.getIn(['ui', 'print', 'printData']),
	search: state.getIn(['ui', 'menubar', 'search']),
	theme: state.getIn(['ui', 'menubar', 'theme']),
	searchValue: state.getIn(['ui', 'profile', 'search', 'keyword']),
	initial: state.getIn(['user', 'initial']),
});

export default withRouter(
	connect(
		matStateToProps,
		{
			menubarOpen,
			menubarClose,
			themeOpen,
			login,
			submitSearchQuery,
			clearPreviousSearch,
			stateMachineTransition,
			profileDrawerClose,
			profileDrawerOpen,
		}
	)(Header)
);
