import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
import gtmDataLayer from 'src/util/gtmDataLayer';
import parseStrToElements from 'src/util/parseStrToElements';
// components
import ActivityEditor from 'src/client/component_activities/module/Editor';
import Header from 'src/client/component_activities/activity/header';
import Title from 'src/client/component_activities/activity/title';
import Browse from 'src/client/component_activities/activity/browse';
import Tag from 'src/client/component_activities/activity/tag';
import Endorse from 'src/client/component_activities/activity/endorse';
import Behavior from 'src/client/component_activities/activity/behavior';
import Comment from 'src/client/component_activities/activity/comment/comment';
import Relative from 'src/client/component_activities/activity/relative';
import AdvanceDropDown from 'src/client/component_activities/module/AdvanceDropDown';
// actions
import { viewActivity } from 'src/client/actions/activity';
import { activityLog } from 'src/client/actions/activity/activityLog.js';

/**
 * 登入會出現
 */
class ActivitySinglePageComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editMode: false,
			confirmDeleteLightBox: false
		};
	}
	componentDidMount() {
		const itemData = this.props.itemData;
		const viewActivityLog = { pid: itemData.pid, page: 'activity' };

		this.props.viewActivity(this.props.itemData);
		activityLog(itemData, viewActivityLog);

		// 傳送開啟的文章到 GTM DataLayer
		gtmDataLayer.sendToDataLayer('Activity', itemData);
	}
	handleEditActivity() {
		this.setState({
			editMode: true
		});
	}
	handleDeleteDropDown() {
		if (/\/m\//g.test(location.href)) {
			location.href = '/m';
		} else {
			location.href = '/';
		}
	}
	handleCloseActivityEditor(isEdit) {
		if (!isEdit) {
			this.handleDeleteDropDown();
		} else {
			this.setState({
				editMode: false
			});
		}
	}
	scrollToTarget(target) {
		const element = ReactDOM.findDOMNode(this.comment);
		var $body = (window.opera) ? (document.compatMode === 'CSS1Compat' ? $('html') : $('body')) : $('html,body');
		$body.animate({
			scrollTop: $(element).offset().top
		}, 500);
	}
	render() {
		const { itemData, index } = this.props;
		const isChannel = itemData.channelInfo && itemData.channelInfo.type === 10;
		return (
			<div styleName="activity_single_page" >
				<Header itemData={ itemData } user={ this.props.user }>
					<AdvanceDropDown
						author={ this.props.itemData.editable }
						itemData={ this.props.itemData }
						mode={ 'singlePage' }
						handleEdit={ this.handleEditActivity.bind(this) }
						handleDelete={ this.handleDeleteDropDown.bind(this) }
						userPid={ this.props.itemData.pid }
						pageName="activity"
					/>
				</Header>
				<article>
					<Title itemData={ itemData } user={ this.props.user } />
					<Browse itemData={ itemData } user={ this.props.user } scrollToTarget={ this.scrollToTarget.bind(this) } />
					<div styleName="activity_content">
						<div className="list" styleName="content_main">
							{ parseStrToElements(this.props.itemData.content) }
						</div>
					</div>
					<Tag itemData={ itemData } user={ this.props.user } />
				</article>
				{
					!isChannel && // 規格：頻道發文不會有肯定
					<Endorse
						itemData={ itemData }
						user={ this.props.user }
						index={ index }
						author={ this.props.author }
					/>
				}
				<Behavior
					itemData={ itemData }
					user={ this.props.user }
					pageName="activity"
				/>
				<Comment
					itemData={ itemData }
					user={ this.props.user }
					index={ this.props.index }
					ref={ (_ref) => this.comment = _ref }
					pageName="activity"
				/>
				<Relative itemData={ itemData } user={ this.props.user } type="singlepage" />
				{
					this.state.editMode &&
					<ActivityEditor
						close={ this.handleCloseActivityEditor.bind(this) }
						itemData={ itemData }
						galleryMode={ itemData.extra.hasOwnProperty('source') && itemData.extra.source === 'gallery' }
					/>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		user: state.user,
		activity: state.activity,
	};
}

const action = { viewActivity };

export default compose(
	connect(mapStateToProps, action),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ActivitySinglePageComponent);
