import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import compose from 'src/util/compose';
import CSSModules from 'react-css-modules';
import css from './index.css';
// actions
import { checkApplicant } from 'src/client/actions/group';

// components
import CheckBox from './checkBox';
import { CheckMember } from 'src/client/component_group/buttons';
import { NameCard } from 'src/client/component_common/card';

class MemberItem extends Component {
	constructor(props){
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	renderTitle(){
		const { mode, userName, avatarWebUrl, jobTitle, companyName, schoolName, major, pid, channelId, checked, checkApplicant, loading, triggerSingle } = this.props;
		const dash = (jobTitle && companyName) || (major && schoolName)? '-':'';
		if( jobTitle || companyName ) return <div>{ jobTitle }{ dash }{ companyName }</div>
		else return <div>{ major }{ dash }{ schoolName }</div>
	}

	render() {
		const { mode, userName, avatarWebUrl, jobTitle, companyName, schoolName, major, pid, channelId, checked, checkApplicant, loading, triggerSingle } = this.props;

		return (
			<dd styleName="member_item">
				<CheckBox
					value={ pid }
					toggled={ checked }
					toggleAction={ checkApplicant }
				/>
				<NameCard
					targetPid={ pid }
					key={ pid }
					href={ `/profile/${pid}` }
					imgSrc={ avatarWebUrl }
					name={ userName }
				/>
				<div styleName="search_content">
					<NameCard
						styleName="user_name"
						targetPid={ pid }
						key={ pid }
						href={ `/profile/${pid}` }
						imgSrc={ avatarWebUrl }
						name={ userName }
						textMode
					/>
					{ this.renderTitle() }
				</div>
				<div styleName="setting_button">
					<CheckMember
						pid={ pid }
						channelId={ channelId }
						loading={ loading }
						onVerify={ triggerSingle }
						// errorHandler={ error }
					/>
				</div>
			</dd>
		)
	}
}

export default compose(
	connect(null, { checkApplicant }),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MemberItem)
