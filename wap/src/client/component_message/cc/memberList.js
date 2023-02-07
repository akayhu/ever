import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// actions
import {getNameCardList} from 'src/client/actions/profile';
import { HaveCountTemplate } from 'src/client/component_common/contactTemplate';

class MemberList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			memberData: [],
			loading: false,
			error: false
		};
		this.handleRetry = this.handleRetry.bind(this);
	}
	componentDidMount() {
		this.fetchNameCardList();
	}
	handleRetry() {
		this.fetchNameCardList();
	}
	fetchNameCardList() {
		const {getNameCardList, memberPids} = this.props;

		this.setState({loading: true});

		getNameCardList({targetPids: memberPids})
			.then(({response}) => {
				if (!response.error || !response.warning) {
					this.setState({
						memberData: Object.keys(response).map(pid => response[pid]),
						error: false,
						loading: false
					});
				} else {
					this.setState({
						error: true,
						loading: false
					});
				}
			});
	}
	render() {
		const {error, loading, memberData} = this.state;
		const {userPid} = this.props;
		if (loading) {
			return (
				<div className="ui loading" />
			);
		}
		if (error) {
			return (
				<div styleName="error_message" onClick={ this.handleRetry } >
					發生錯誤，請點此重試
				</div>
			);
		}

		return (
			<div>
				{memberData.map((item, index) => {
					
					const { pid: targetPid, ...other} = item;

					return(
						<HaveCountTemplate
							key={ index }
							{ ...other }
							pid={ userPid }
							targetPid={targetPid}
						/>);
					})}
			</div>
		);
	}
}

export default compose(
	connect(null, {getNameCardList}),
	[CSSModules, '_', css]
)(MemberList);
