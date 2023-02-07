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

class ExcludeList extends Component {
	constructor( props ){
		super( props );
		this.state = {}
	}
	handleOnSubmit() {
		this.props.exclude({pid: this.props.user.pid, targetPid: this.props.pid, status: true})
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
				<div styleName="blockListText">設為拒接訊息後，{ this.props.userName }將無法再：</div>
				<ul>
					<li>查看你在首頁上發表的內容</li>
					<li>標註你</li>
					<li>邀請你參加的社團</li>
					<li>開始和你的對話</li>
					<li>加你為朋友</li>
				</ul>
				{
					this.props.connect === 3 &&
					<div styleName="blockListSubText">如果你們是朋友，加入拒接訊息將會解除朋友關係。<br />或許在這之前，你可以考慮先解除朋友關係</div>
				}
				<div styleName="blockListSubButton">
					<button ref="saveBasicButton" className="ui primary button" onClick={ this.handleOnSubmit.bind(this) }>加入拒接訊息</button>
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
	)(ExcludeList);