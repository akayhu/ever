import React, { Component, Fragment } from 'react';
import { Map, List } from 'immutable';
import withScrollAnchor from 'containers/scrollAnchor';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { changeShowTag } from 'actions/ui/factory';
import config from 'config/nameMap';
import GithubRepo from '../components/githubRepo';
import BehanceRepo from '../components/behanceRepo';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { requestFetchConnectorSnapshot } from 'actions/blocks/connector';
import { sendToDataLayer } from 'utils/gtmDataLayer';
import { isMobile } from 'react-device-detect';

class CategoryTitle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// REFACTOR: 整理 connector panel 顯示邏輯
			github: false,
			behance: false,
		};
	}

	// REFACTOR: 整理 connector panel 顯示邏輯
	/* githubRepo lightbox開關 */
	_closeGithubRepo = () => {
		// this.props.changeShowTag('github');
		this.setState({ github: false });
	};

	/* behanceRepo lightbox開關 */
	_closeBehanceRepo = () => {
		// this.props.changeShowTag('behance');
		this.setState({ behance: false });
	};

	// REFACTOR: 整理 connector panel 顯示邏輯
	/* 左側欄開啟狀態 */
	_checkType = blockType => {
		const {
			commonMode,
			discriminate,
			connector,
			lightboxOpen,
			changeShowTag,
		} = this.props;

		if (commonMode && discriminate === 'commonMode' && isMobile) {
			return alert('請使用電腦編輯操作');
		}

		const connectorServices = List(['github', 'behance']);

		// 若第三方服務沒快照，則打開 lightbox
		if (connectorServices.includes(blockType)) {
			const hasSnapshot = connector.getIn([blockType, 'hasSnapshot'], false);

			// NOTE: REFACTOR: 判斷第一次完成第三方服務認證
			//   behanceConnect 是用快照有無 (hasSnapshot)
			//   github 是用 token 有無 (hasToken) 判斷時機點只好在 githubRepo 拿 rawData 確認 token
			if (blockType === 'behance') {
				sendToDataLayer({ behanceConnect: hasSnapshot });
			}
			if (!hasSnapshot) {
				lightboxOpen();
				this.setState({ [blockType]: true });
				return;
			}

			// REFACTOR: 有快照代表有 token
			if (blockType === 'github') {
				sendToDataLayer({ githubConnect: true });
			}
		}
		changeShowTag(blockType);
	};

	handleScrollToBlock = e => {
		e.stopPropagation();
		this.props.scrollToAnchor(this.props.uniKey);
	};

	render() {
		const { github, behance } = this.state;
		const { title, blockType, icon, user, fontSize } = this.props;
		const iconName = icon || config[blockType].icon;
		return (
			<Fragment>
				<FlatButton
					fullWidth={true}
					label={title}
					labelStyle={{ textTransform: 'none' }}
					icon={
						<FontIcon
							className={`icon-${iconName}`}
							style={{
								fontSize: fontSize ? `${fontSize}px` : '38px',
								marginLeft: '0px',
							}}
						/>
					}
					onClick={() => this._checkType(blockType)}
					style={{ textAlign: 'left', height: '48px' }}
					data-gtm-editor-tab={title}
				>
					{this.props.visibility && this.props.blockType !== 'custom' && (
						<div onClick={this.handleScrollToBlock}>
							<FontIcon
								className="material-icons"
								style={{
									fontSize: '18px',
									color: '#f5b532',
									position: 'absolute',
									top: 'calc(50% - 9px)',
									right: '15px',
								}}
							>
								my_location
							</FontIcon>
						</div>
					)}
				</FlatButton>
				{/* REFACTOR: 合併三個 */}
				{/* github lightbox */
				github && (
					<GithubRepo
						closeGithubRepo={this._closeGithubRepo}
						user={user.toJS()}
					/>
				)}
				{/* behance lightbox */
				behance && (
					<BehanceRepo
						closeBehanceRepo={this._closeBehanceRepo}
						user={user.toJS()}
					/>
				)}
			</Fragment>
		);
	}
}

const mapStateToPorps = (state, props) => ({
	list: state.get('blocksList'),
	theme: state.getIn(['ui', 'factory', 'theme']),
	removeHint: state.getIn(['ui', 'toolbar', 'removeHint']),
	user: state.get('user'),
	connector: state.getIn(['connector']),
	visibility: state
		.get('config')
		.find(block => block.get('blockType') === props.blockType, this, Map())
		.get('visibility', false),
	uniKey: state
		.get('config')
		.find(block => block.get('blockType') === props.blockType, this, Map())
		.get('uniKey', null),
});

export default compose(
	connect(
		mapStateToPorps,
		{
			changeShowTag,
			requestFetchConnectorSnapshot,
			lightboxOpen,
			lightboxClose,
		}
	),
	withScrollAnchor
)(CategoryTitle);
