import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
// selectors
//import { getBCMsgList } from 'src/client/reducers/selectors';
// actions
import { triggerGetMsgList, changeReadingJobNo } from 'src/client/actions/bcCommunication';
// components
//import Title from 'src/client/component_message/bc/title';
import LeftSideNavigation from 'src/client/component_message/bc/leftSideNavigation';

//import BCLeftHalf from 'src/client/component_message/bc/bcLeftHalf';
import MessageRightHalf from 'src/client/component_message/bc/messageRightHalf';
import {components as CPlatformComponents} from 'c_platform';
import $ from 'jquery';
import css from './index.css';

const ViewWrapper = CPlatformComponents.ViewWrapper;

class BCCommunication extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showHelp: false
		};
		
	}
	componentDidMount() {
		if (!this.props.user.isLogin && this.props.location.query.jobNo) {
			this.redirect();
		}

		$('html').addClass('full_height');

		if(this.props.location && this.props.location.query && this.props.location.query.jobNo){
			this.props.user.isLogin && this.props.triggerGetMsgList(this.props.location.query.jobNo);
		}else{
			this.props.user.isLogin && this.props.triggerGetMsgList();
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.location.query.jobNo !== nextProps.location.query.jobNo) {
			this.props.triggerGetMsgList(nextProps.location.query.jobNo);
		}
	}
	componentWillUnmount() {
  	$('html').removeClass('full_height')
  }
	redirect() {
		const url = `/sso/saml-login?r=/message/bc?jobNo=${this.props.location.query.jobNo}`;
		location.href = url;
	}
	changeActive(JobNo) {
		this.props.changeReadingJobNo(JobNo);
	}
	showHelp() {
		this.setState({
			showHelp: true
		});
	}
	closeHelp() {
		this.setState({
			showHelp: false
		});
	}
	render() {
		const { user } = this.props;
		return (
			<ViewWrapper {...this.props}>
				<div className="container_wrap original_panel" styleName="wrapper">
					<div className="header clearfix">
						<div className="title">
							<h2>貴人來敲門</h2>
							<span className="text">企業透過104想探詢你的聯絡意願。在你未同意前，企業無法取得聯絡資訊</span>
						</div>
						<div className="options">
		          <span onClick={ this.showHelp.bind(this) }>
		          	如何遇到貴人 <i className="help circle icon"></i>
		          </span>
		          {
		          	this.state.showHelp && 
		          	<div className="layer" styleName="help_content">
			            <div>
			            	<i className="icon cross" onClick={ this.closeHelp.bind(this) } /><br />
			            </div>
			            多數企業求才若渴，或者正在搜尋未來的夥伴，他們知道許多人才隱身在各行各業中，因此期望透過104探詢人才的聯繫意願，為未來的合作留下可能性。
			            <br /><br />
			            如果你願意讓更多的機會找上你，你也可以<a href="#">做自己的貴人</a>
			          </div>
		          }
		        </div>
					</div>
					<div className="wrap_w300_m0_w660 body">
						<div className="left_side aside">
							<LeftSideNavigation handleClick={this.changeActive.bind(this)}
							/>
						</div>
						<div className="right_side">
							<MessageRightHalf user={ user } location={this.props.location} />
						</div>
					</div>
				</div>
			</ViewWrapper>
		);
	}
}

function mapStateToProps(state) {
	return {
		//msgListData: getBCMsgList(state),
		user: state.user,
	};
}

const actions = {
	triggerGetMsgList, changeReadingJobNo
};

export default compose(
		connect(mapStateToProps, actions),
		//translate([]),
		[CSSModules, '_', css, { allowMultiple: true }]
	)(BCCommunication);