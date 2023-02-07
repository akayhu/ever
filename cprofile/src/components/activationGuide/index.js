import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Lightbox from '../lightbox';
import { lightboxOpen, lightboxClose } from 'actions/ui/lightbox';
import { noviceGuideStart } from 'actions/ui/noviceGuide';
import { postPlusFlow, changeStatus } from 'actions/serviceInfo';
import './style.scss';
import {
	SubmitButton,
	GrayBorderButtonWhiteBackground,
} from 'share/styledComponents';

class ActivationGuide extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: true,
		};
	}

	triggerLightbox = value => {
		this.setState({ open: value });
	};

	_renderContent = () => {
		return (
			<div className="activation_content">
				<p>
					『104 職涯社群』全面改版更名為『104 個人檔案』
					<br />
					簡單快速 3 步驟，即可打造您亮眼的專業形象，顛覆你對履歷表的想像。
				</p>
				<ul className="feature_ist">
					<li>1. 多款彈性專業俐落的樣板供選擇</li>
					<li>2. 自由拖拉資訊呈現順序</li>
					<li>3. 一鍵匯入在GitHub或Behance 的作品集</li>
				</ul>
				<p>現在只要發佈檔案，就可讓專業被更多人看見 !</p>
			</div>
		);
	};

	_handleHistoryPreview = name => {
		const { pid } = this.props;
		const status = 2;
		this.props.postPlusFlow({ status, pid });
		this.props.changeStatus(status);
		this.props.lightboxClose();
		this.props.history.push(`/preview/${name}`);
	};

	_handleNoviceGuide = () => {
		const { pid } = this.props;
		const status = 1;
		this.props.postPlusFlow({ status, pid });
		this.props.changeStatus(status);
		this.props.lightboxClose();
		setTimeout(() => {
			this.props.noviceGuideStart();
		}, 500);
	};

	_renderButton = () => {
		return (
			<div className="activation-button">
				<GrayBorderButtonWhiteBackground
					className="expeience-btn"
					onClick={this._handleNoviceGuide}
				>
					立即體驗
				</GrayBorderButtonWhiteBackground>

				<SubmitButton
					className="publish-btn"
					onClick={this._handleHistoryPreview.bind(this, 'web')}
				>
					發佈檔案
				</SubmitButton>
			</div>
		);
	};

	componentDidMount = () => {
		this.props.lightboxOpen();
	};

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.open === this.state.open) {
			return false;
		}
		return true;
	}

	render() {
		const { open } = this.state;
		if (open) {
			return (
				<Lightbox
					maskClosable={false}
					keyboard={false}
					closable={false}
					afterClose={this.triggerLightbox.bind(this, false)}
					cssClassName="activationLightbox"
					title="104職涯社群服務轉移宣告"
					width="580px"
				>
					<div className="activation_main">
						{this._renderContent()}
						{this._renderButton()}
					</div>
				</Lightbox>
			);
		}

		return null;
	}
}

const mapStateToProps = state => ({
	newVisitor: state.getIn(['ui', 'activationGuide', 'brandNewVisitor']),
	pid: state.getIn(['user', 'pid']),
	showEditorService: state.getIn(['serviceInfo', 'showEditorService']),
});

const enhance = compose(
	withRouter,
	connect(
		mapStateToProps,
		{
			lightboxOpen,
			lightboxClose,
			noviceGuideStart,
			postPlusFlow,
			changeStatus,
		}
	)
);

export default enhance(ActivationGuide);
