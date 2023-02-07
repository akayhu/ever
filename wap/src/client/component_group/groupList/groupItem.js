import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import Image from 'src/client/component_common/image';
import css from './index.css';

class GroupItem extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	renderLink() {
		const { mode, groupInfo } = this.props;
		const { id, name } = groupInfo;
		let path, step, stateData;
		if (mode === 'checking' || mode === 'rejected') {
			path = '/group/applyform';
			step = mode === 'checking' ? 'step2' : 'step3';
			stateData = { groupInfo, step };
		} else {
			path = `/group/${id}`;
			step = 'step1';
			step = { step };
		}
		return (
			<Link to={ { pathname: path, state: stateData } }>
				{ name }
			</Link>
		);
	}
	render() {
		const { groupInfo } = this.props;
		const { coverWebUrl } = groupInfo;
		return (
			<div styleName="group_list_block">
				<div styleName="group_list_block_img">
					<Image
						type={ 'cover' }
						domain={ 'group' }
						src={ coverWebUrl }
					/>
				</div>
				<div styleName="group_list_content">
					{ this.renderLink() }
				</div>
				<div styleName="setting_block">
					{ this.props.children }
				</div>
			</div>
		);
	}
}

export default compose(
	[CSSModules, '_', css, { allowMultiple: true }]
)(GroupItem);
