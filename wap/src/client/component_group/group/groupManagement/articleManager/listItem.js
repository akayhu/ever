import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';

// actions
import { checkActivity, deleteActivity } from 'src/client/actions/group';
// components
import { CheckBox, DeleteGroupActivity } from 'src/client/component_group/buttons';

class ListItem extends Component {
	constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const { userInfo: { userName }, title, createDateStr, checked, pid, aid, checkActivity, deleteActivity, channelId } = this.props;
		return (
			<tr>
				<td>
					<CheckBox
						value={ aid }
						toggled={ checked }
						toggleAction={ checkActivity }
					/>
				</td>
				<td><a href="#">{ userName }</a></td>
				<td>{ title }</td>
				<td>{ createDateStr.split(' ')[0] }</td>
				<td>
					<DeleteGroupActivity
						params={{
							channelId,
							aidList: [aid]}
						}
						act={ deleteActivity }
						/>
				</td>
			</tr>
		);
	}
}

export default compose(
	connect(null, { checkActivity, deleteActivity }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ListItem)
