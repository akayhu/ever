import { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import generalConfig from 'config/general';
import { isValidStage } from 'utils/validation';
import { triggerSurvey } from 'actions/ui/survey';

/**
 * 觸發規則 (取第一個被觸發的條件)
 * 1. 瀏覽網站 15 min
 * 2. 點擊預覽
 * 3. 點擊發佈
 */
class Survey extends Component {
	timer = null;

	componentDidMount = () => {
		// 測試用，立即顯示問卷 & 停止寫入已調查的 cookie NPS_xxxx_surveyed
		global.wootric_survey_immediately = true;
		global.wootric_no_surveyed_cookie = isValidStage(['local', 'lab']);

		// 初始化 Wootric
		global.wootricSettings = {
			account_token: generalConfig.wootric,
			product_name: '104個人檔案',
			created_at: Math.floor(Date.now() / 1000),
		};

		// 預設進入網站後 15 分鐘觸發
		if (!this.props.hasSurveyed) {
			this.timer = setTimeout(this.props.triggerSurvey, 900000);
		}
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (!this.props.getUserDone) return;

		// enable 狀態切換時才作用
		if (this.props.enable) {
			this.triggerWootric();
		}
	};

	// 執行 wootric nps survey
	triggerWootric = () => {
		// 針對 prerender、開發環境、已調查過則不啟用 wootric
		if (window.injectProperty) return;
		if (isValidStage(['local'])) return;
		if (this.props.hasSurveyed) return;

		global.wootricSettings.email = this.props.pid;
		global.wootricSettings.properties = {
			pid: this.props.pid,
			stage: process.env.REACT_APP_STAGE,
		};
		global.WootricSurvey.run();
		this.timer = null;
	};

	render() {
		return null;
	}
}

const mapStateToProps = state => ({
	enable: state.getIn(['ui', 'survey', 'enable']),
	hasSurveyed: state.getIn(['ui', 'survey', 'hasSurveyed']),
	pid: state.getIn(['user', 'pid']),
	getUserDone: state.getIn(['user', 'status']) === 'done',
});

export default compose(
	withRouter,
	connect(
		mapStateToProps,
		{
			triggerSurvey,
		}
	)
)(Survey);
