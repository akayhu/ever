import { connect } from 'react-redux';
import { Link } from 'react-router';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

import { exclude, getExcludeList } from 'src/client/actions/connection';
import Image from 'src/client/component_common/image';

import clientConfig from 'src/configs/client';

class RemoveExcludeList extends Component {
	constructor( props ){
		super( props );
		this.state={};
	}
	handleOnSubmit() {
		this.props.exclude({pid: this.props.user.pid, targetPid: this.props.pid, status: false})
		.then(function(result){
			this.props.getExcludeList({pid: this.props.user.pid});
			this.props.handleLightBoxCancel();
		}.bind(this));
	}
	handleCancel() {
		this.props.handleLightBoxCancel();
	}
	render() {
		return (
			<div styleName="blockListMain">
				<div styleName="blockListNameCard">
					<Link to={`/profile/${this.props.pid}`}>
						<Image
							src={ this.props.avatarWebUrl }
							type="avatar"
						/>
					</Link>
					<Link to={`/profile/${this.props.pid}`}>
						<span styleName='blockName'>{ this.props.userName }</span>
					</Link>
				</div>
				<div styleName="blockListText">移除拒接訊息後：</div>
				<ul>
					<li>取決於你的隱私設定，{ this.props.userName }可以從首頁看到你的動態。</li>
					<li>{ this.props.userName }也可以看到你的個人檔案頁公開的資訊，並透過訊息中心和你連絡。</li>
				</ul>
				<div styleName="blockListSubButton">
					<button ref="saveBasicButton" className="ui primary button" onClick={ this.handleOnSubmit.bind(this) }>移除拒接訊息</button>
					<button className="ui normal button" onClick={ this.handleCancel.bind(this) }>取消</button>
				</div>
			</div>
		);
	}
}

const actions = {
	exclude, getExcludeList
}

export default compose(
		connect(null, actions),
		//translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(RemoveExcludeList);