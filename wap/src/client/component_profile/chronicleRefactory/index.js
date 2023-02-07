import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
// import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';
import hasPermission from 'src/client/services/viewas.js';
import ChronicleEXP from './experience';
import ChronicleEDU from './education';
import ChronicleHonor from './honor';
import DelHint from './component/itemUnit/delhint';
import { loadChronicle } from 'src/client/actions/chronicle';
import { createFromPromotion } from 'src/client/actions/global';
import compose from 'src/util/compose';

class Chronicle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lightbox: false,
			hinttext: 'exp',
		};
		// 判斷資料載完了沒有
		this.fetchFinished = false;
		this.editTrigger = e => this.editChronicle(e);
		this.delTrigger = e => this.handleLightbox(e);
		this.delHandle = () => this.props.createFromPromotion('none');
	}
	componentDidMount() {
		this.fetchFinished = false;
		this.props.loadChronicle({targetPid: this.props.params.pid})
			.then(() => { this.fetchFinished = true; });
	}
	componentWillReceiveProps({anchorTo}) {
		if (anchorTo !== this.props.anchorTo) {
			this.scrollInto({blockName: anchorTo});
		}
	}
	scrollInto({blockName, node, times = 10}) {
		if (times <= 0) return;
		if (!node && blockName === 'honor') {
			node = findDOMNode(this.honorBlock);
		}
		if (node) {
			if (!this.fetchFinished) {
				// 若是資料還沒載完，等200毫秒後重試;
				setTimeout(() => this.scrollInto({blockName, node, times: times - 1}), 200);
			} else {
				node.scrollIntoView();
			}
		} else {
			// 節點還沒產生，重新執行
			setTimeout(() => this.scrollInto({blockName, times: times - 1}), 200);
		}
	}
	editChronicle(promotion) {
		this.props.createFromPromotion({ promotion });
	}
	handleLightbox(hinttext) {
		this.setState({ lightbox: (this.state.lightbox === false), hinttext });
	}
	render() {
		const { exp, edu, honor } = this.props.chronicle;
		const expData = (this.props.viewas === 'self') ? exp : exp.filter((obj) => { return (obj.privacySetting === 1); });
		const eduData = (this.props.viewas === 'self') ? edu : edu.filter((obj) => { return (obj.privacySetting === 1); });
		const honorData = (this.props.viewas === 'self') ? honor : honor.filter((obj) => { return (obj.privacySetting === 1); });
		return (
			<div>
				{
					hasPermission(this.props.viewas, this.props.privacy.experience, this.props.pid, this.props.params.pid) &&
					<ChronicleEXP
						dataArray={ expData }
						viewas={ this.props.viewas }
						promotion={ this.props.promotion }
						privacy={ this.props.privacy.experience }
						editTrigger={ this.editTrigger }
						delTrigger={ this.delTrigger }
					/>
				}
				{
					hasPermission(this.props.viewas, this.props.privacy.education, this.props.pid, this.props.params.pid) &&
					<ChronicleEDU
						dataArray={ eduData }
						viewas={ this.props.viewas }
						promotion={ this.props.promotion }
						privacy={ this.props.privacy.education }
						editTrigger={ this.editTrigger }
						delTrigger={ this.delTrigger }
					/>
				}
				{
					hasPermission(this.props.viewas, this.props.privacy.honor, this.props.pid, this.props.params.pid) &&
					<ChronicleHonor
						dataArray={ honorData }
						viewas={ this.props.viewas }
						promotion={ this.props.promotion }
						privacy={ this.props.privacy.honor }
						editTrigger={ this.editTrigger }
						delTrigger={ this.delTrigger }
					/>
				}
				{
					this.state.lightbox &&
					<DelHint
						text={ hinttext(this.state.hinttext) }
						delHandle={ this.delHandle }
						cancel={ this.handleLightbox.bind(this) }
					/>
				}
			</div>
		);
	}
}

function hinttext(hinttext) {
	switch (hinttext) {
		case 'experience':
			return '經歷';
		case 'edu':
			return '學歷';
		case 'honor':
			return '成就';
		default:
			return '資料';
	}
}

export default compose(
	connect(null, { loadChronicle, createFromPromotion }),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Chronicle);
