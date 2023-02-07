import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

// actions
import { initPj, toggleLightbox, pjTypeConfig } from 'src/client/actions/test/pj';

// components
import { LightBox } from 'c_wap_module';
import { Report, Answer, SimpleDone } from 'src/client/component_test/job';

// selector
import { getConfig } from 'src/client/reducers/test/pj';

class Job extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nextLocationPathName: null
		};
	}
	componentDidMount() {
		this.props.initPj(this.props.location.query);		
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
	}
	routerWillLeave(nextLocation) {
		const { page, toggleLightbox } = this.props;
		if ((page === 'simple_answer' || page === 'advanced_answer') && this.state.nextLocationPathName === null) {
			toggleLightbox(true, '您還在作答中，確定離開嗎?');
			this.setState({
				nextLocationPathName: nextLocation
			});
			return false;
		}
		return true;
	}
	goOutSide() {
		this.props.toggleLightbox(false);
		this.props.router.push(this.state.nextLocationPathName);
	}
	closeLightBox() {
		this.setState({
			nextLocationPathName: null,
		});
		this.props.toggleLightbox(false);
	}
	render() {
		const { pid, page, index, loading, report, config, future, status, lightboxStatus, config: { part, question = 1 } } = this.props;
		return (
			<div>
				{
					(page === 'simple_intro' || page === 'simple_answer' || page === 'advanced_intro' || page === 'advanced_answer') &&
					<Answer
						pid={ pid }
						page={ page }
						index={ index }
						part={ part }
						question={ question }
						loading={ loading }
					/>
				}
				{
					page === 'simple_done' &&
					<SimpleDone
						config={ config }
					/>
				}
				{
					page === 'report' &&
					<Report
						loading={ loading }
						config={ config }
						report={ report }
						future={ future }
						status={ status.status }
					/>
				}
				{
					lightboxStatus.isShow &&
					<LightBox
						option={ {
							closeIcon: true,
							submit: {
								text: '確定',
								action: this.state.nextLocationPathName ? this.goOutSide.bind(this) : this.closeLightBox.bind(this)
							},
							cancel: this.state.nextLocationPathName ? {text: '取消'} : null
						} }
						onClose={ this.closeLightBox.bind(this) }
					>
						<div>{ lightboxStatus.text }</div>
					</LightBox>
				}
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const nowState = state.test.pj;
	return {
		pid: state.user.pid,
		page: nowState.page,
		index: nowState.index,
		loading: nowState.loading,
		report: nowState.report,
		future: nowState.future,
		status: nowState.status,
		lightboxStatus: nowState.lightboxStatus,
		config: getConfig(state.profile.config, pjTypeConfig),
	};
}

const actions = { initPj, toggleLightbox };
export default compose(
	connect(mapStateToProps, actions),
	[CSSModules, '_', css, { allowMultiple: true }]
)(Job);
