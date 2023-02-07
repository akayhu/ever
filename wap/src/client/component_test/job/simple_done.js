import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import clientConfig from 'src/configs/client';
// actions
import { readyUpdatePersonlConfig, changePage } from 'src/client/actions/test/pj';

class SimpleDone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobcat: props.config.jobcat,
			jobcatName: props.config.jobcatName
		};
	}
	openE104Menu2011() {
		const myconfig = {
			id: 'menu001',
			init_Div: 'divorg',
			DataSource: 'JobCatRoot',
			maxChoose: '1',
			title: '選擇類目',
			chooseHelperMsg: '請選擇想察看報告的職務',
			searchBox: '1',
			se_URL: `${clientConfig.params.e104Url}/ifeeds/helper/searchbox.cfm?type=2`,
			se_SearchLevel: '3',
			main_ColumnType: '2',
			sub_ContentType: '23',
			sub_ColumnType: '2',
			se_ShowDetail: 'yes',
			lightBox: '0',
			hiddenCheckBox: '2[0-9]{3}[0-9]{3}000',
			choiceNumber: '2',
			mscb: '1',
			chooseItems: [{no: this.state.jobcat}]
		};
		const that = this;
		const { readyUpdatePersonlConfig } = this.props;
		window.E104Menu2011.prototype.callBack = function () {
			if (this.config.chooseItems.length === 0) return;
			const { des, no } = this.config.chooseItems[0];
			readyUpdatePersonlConfig({
				jobcat: no,
				jobcatName: des
			});
			that.setState({
				jobcat: no,
				jobcatName: des
			});
		};
		window.openE104Menu2011(myconfig);
	}
	render() {
		const { changePage } = this.props;
		const { jobcatName } = this.state;
		return (
			<div className="original_panel">
				<div id="divorg" />
				<div className="header clearfix">
					<div className="title">
						<h2>簡易版測驗完成</h2>
					</div>
				</div>
				<div styleName="simple_done">
					<div>
						您已完成34題簡短版性格量表的填寫，請選擇你想要的評估從事職業的工作適合度。
						<div styleName="btn_section">
							<button
								className="ui line button"
								onClick={ this.openE104Menu2011.bind(this) }
							>
								{ jobcatName || '選擇類目' }
							</button>
							<button
								className="ui primary button"
								onClick={ () => changePage('report') }
							>
								察看概略分析
							</button>
						</div>
					</div>
					<div>
						建議你再加填102題完整版量表題目(作答時限16分半鐘)，得到最精準的性格及適合從事職類的完整分析，以利您的職涯發展與選擇。
						<div styleName="btn_section">
							<button
								className="mini ui primary button"
								onClick={ () => changePage('advanced_intro') }
							>
								繼續完整量表，取得精確分析
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const actions = { readyUpdatePersonlConfig, changePage };

export default compose(
	connect(null, actions),
	[CSSModules, '_', css, { allowMultiple: true }]
)(SimpleDone);
