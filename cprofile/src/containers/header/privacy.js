import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Radio, Tooltip, Alert } from 'antd';
import DOMPurify from 'dompurify';
import generalConfig from 'config/general';
import fbImg from 'components/defaultSmallImage/facebook.png';
import lineImg from 'components/defaultSmallImage/line.png';
import mailImg from 'components/defaultSmallImage/mail.png';
import inlineLoading from './inlineLoading.svg';
import { setProfilePrivacy } from 'actions/profile';
import { stateMachineTransition } from 'actions/ui/statemachine';
import { SubmitButtonSmallSquare } from 'share/styledComponents';
import './privacy.scss';

class Privacy extends Component {
	static propTypes = {
		privacy: PropTypes.oneOf(['PUBLIC', 'LINK', 'PRIVATE', null]),
		visible: PropTypes.bool.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			privacy: props.privacy,
			showLinkHint: false,
			showLinkLoading: false,
			showError: false,
			currentSubFrame: props.currentSubFrame,
		};
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.currentSubFrame === nextProps.currentSubFrame) return null;
		switch (nextProps.currentSubFrame) {
			case 'switchLoading': {
				return {
					...prevState,
					showLinkHint: false,
					showLinkLoading: true,
					showError: false,
					currentSubFrame: nextProps.currentSubFrame,
				};
			}
			case 'public': {
				return {
					...prevState,
					privacy: 'PUBLIC',
					showLinkHint: false,
					showLinkLoading: false,
					showError: false,
					currentSubFrame: nextProps.currentSubFrame,
				};
			}
			case 'link': {
				return {
					...prevState,
					privacy: 'LINK',
					showLinkHint: true,
					showLinkLoading: false,
					showError: false,
					currentSubFrame: nextProps.currentSubFrame,
				};
			}
			case 'setPrivacy': {
				return {
					...prevState,
					showLinkHint: false,
					showLinkLoading: true,
					showError: false,
					currentSubFrame: nextProps.currentSubFrame,
				};
			}
			case 'error': {
				return {
					...prevState,
					showLinkHint: false,
					showLinkLoading: false,
					showError: true,
					currentSubFrame: nextProps.currentSubFrame,
				};
			}
			default: {
				return null;
			}
		}
	}

	// [event handler] ????????????????????????
	onChangePrivacy = e => {
		this.setState(
			{
				privacy: e.target.value,
			},
			() => {
				this.props.setProfilePrivacy(this.state.privacy);
				this.props.stateMachineTransition('privacy', 'SET_PRIVACY');
			}
		);
	};

	// [event handler] ????????????
	onCopyUrl = () => {
		document.getElementById('editor_publish_sharelink_input').select();
		document.execCommand('copy');
	};

	// [util] ????????????????????????????????????
	getLinkFromPrivacy = (privacy = this.state.privacy) => {
		let link = `https:${generalConfig.siteUrl}/profile/${this.props.pid}`;

		if (privacy === 'LINK') {
			link += `?t=${DOMPurify.sanitize(this.props.token, {
				ALLOWED_TAGS: [],
				KEEP_CONTENT: true,
			})}`;
		}
		return link;
	};

	renderRightButton = () => (
		<div className="privacy__option-right">
			<a
				href={this.getLinkFromPrivacy()}
				target="_blank"
				rel="noopener noreferrer"
			>
				<SubmitButtonSmallSquare>?????????????????????</SubmitButtonSmallSquare>
			</a>
		</div>
	);

	renderUploadFailedBlock = () => {
		const publish = this.props.publish.toJS().uploadFailedBlocks;

		if (JSON.stringify(publish) === '{}') {
			return false;
		}

		return (
			<b className="privacy__title">
				?????????????????????????????????????????????????????????????????????
				<br />({publish.gallery && `?????????${publish.gallery}`}
				{publish.gallery && publish.custom && ' '}
				{publish.custom && `???????????????${publish.custom}`}
				{publish.honor && ' '}
				{publish.honor && `????????????${publish.honor}`})
			</b>
		);
	};

	render() {
		return (
			<Fragment>
				{this.state.showLinkHint && (
					<Alert
						className="privacy__top-alert"
						showIcon={false}
						message="????????????????????????????????????????????????????????????"
						banner
					/>
				)}
				<div className="privacy__wrapper">
					{this.renderUploadFailedBlock()}
					{/* ???????????? */}
					<Radio.Group
						className="privacy__share-setting"
						onChange={this.onChangePrivacy}
						defaultValue="PUBLIC"
						value={this.state.privacy}
					>
						<div className="privacy__option">
							<div className="privacy__option-left">
								<Radio value="PUBLIC" id="editor_publish_public_button" />
								<div className="privacy__description">
									<b>??????</b>
									<p>??????????????????????????????????????????????????????????????????</p>
								</div>
							</div>
							{!this.state.showLinkHint &&
								!this.state.showLinkLoading &&
								this.renderRightButton()}
						</div>
						<div className="privacy__option">
							<div className="privacy__option-left">
								<Radio value="LINK" id="editor_publish_sharelink_option" />
								<div className="privacy__description">
									<b>????????????</b>
									<p>???????????????????????????????????????????????????????????????</p>
								</div>
							</div>
							{this.state.showLinkHint &&
								!this.state.showLinkLoading &&
								this.renderRightButton()}
						</div>
					</Radio.Group>
					{this.state.showLinkLoading ? (
						<img
							className="privacy__loading"
							src={inlineLoading}
							alt="???????????????"
						/>
					) : (
						/* ???????????? */
						<Fragment>
							<div className="privacy__url">
								<input
									id="editor_publish_sharelink_input"
									type="text"
									readOnly
									value={this.getLinkFromPrivacy()}
								/>
								<div className="privacy__tool">
									<Tooltip placement="top" title="????????????">
										<i
											className="icon-copy"
											style={{ marginRight: '5px' }}
											onClick={this.onCopyUrl}
										/>
									</Tooltip>
									<Tooltip placement="top" title="?????????????????????">
										<a
											href={this.getLinkFromPrivacy()}
											style={{ display: 'inline-flex' }}
											target="_blank"
											rel="noopener noreferrer"
										>
											<i className="icon-earth" />
										</a>
									</Tooltip>
								</div>
							</div>
							{this.state.showLinkHint && (
								<p className="privacy__hint">
									???????????????????????????????????????????????????????????????????????????????????????????????????
								</p>
							)}
							<p className="privacy__hint">
								<a
									href={`https:${
										generalConfig.my104Url
									}/my104/resume/attachment/index`}
									target="_blank"
									onClick={this.onCopyUrl}
									rel="noopener noreferrer"
								>
									???????????????????????????????????????????????????
								</a>
							</p>
						</Fragment>
					)}
				</div>
				{/* ???????????? */}
				{!this.state.showLinkLoading && (
					<div className="privacy__share">
						<Tooltip placement="top" title="????????? Facebook">
							<a
								href={`//www.facebook.com/sharer.php?u=${this.getLinkFromPrivacy()}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img src={fbImg} alt="Facebook" width="40" height="40" />
							</a>
						</Tooltip>
						<Tooltip placement="top" title="????????? Line">
							<a
								href={`//line.naver.jp/R/msg/text/?${this.getLinkFromPrivacy()}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img src={lineImg} alt="Line" width="40" height="40" />
							</a>
						</Tooltip>
						<Tooltip placement="top" title="????????????????????????">
							<a
								href={`mailto:?body=${this.getLinkFromPrivacy()}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<img src={mailImg} alt="Mail" width="40" height="40" />
							</a>
						</Tooltip>
					</div>
				)}
			</Fragment>
		);
	}
}

const mapStateToProps = state => ({
	pid: state.getIn(['user', 'pid']),
	visible: state.getIn(['ui', 'lightbox', 'visible'], false),
	privacy: state.getIn(['profile', 'privacy', 'type'], 'PUBLIC'),
	token: state.getIn(['profile', 'privacy', 'token'], null),
	currentSubFrame: state.getIn(['ui', 'statemachine', 'privacy', 'value']),
	publish: state.getIn(['publish']),
});

export default connect(
	mapStateToProps,
	{
		stateMachineTransition,
		setProfilePrivacy,
	}
)(Privacy);
