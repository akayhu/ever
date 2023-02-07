import React, { Component } from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';
import { loadDataCenter } from 'src/client/actions/channel';
import { getDataList, getIsLoading } from 'src/client/reducers/channel';
import ChannelList from 'src/client/component_channel/channelList';
import CardListItem from 'src/client/component_common/cardListItem';
import SubscribeBtn from '../buttons/subscribeBtn';

class IndexContent extends Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	render() {
		const { channelDataList, listLoading, activeTab, pid } = this.props;
		return (
			<div styleName="index_wrapper">
				<ChannelList
					activeTab={ activeTab }
					channelDataList={ channelDataList }
					listLoading={ listLoading }
				>
					{
						channelDataList.map(data => (
							<CardListItem
								pid={ pid }
								key={ data.id }
								id={ data.id }
								domain={ 'channel' }
								cover={ data.coverWebUrl }
								title={ data.name }
								description={ data.description }
								statCount={ data.subscribeCount }
								avatarList={ data.subscriberList }
							>
								{ !data.isAdmin &&
								<SubscribeBtn
									isAdmin={ data.isAdmin }
									isEditor={ data.isEditor }
									isLogin={ this.props.isLogin }
									channelId={ data.id }
									subscribeSetting={ data.subscribe }
									haveReload
								/>
								}
							</CardListItem>
						))
					}
				</ChannelList>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	const nowState = state.channel;
	return {
		isLogin: state.user.isLogin,
		pid: state.user.pid,
		channelDataList: getDataList(nowState, props.activeTab),
		listLoading: getIsLoading(nowState, props.activeTab)
	};
}

function mapDispatchToProps(dispatch) {
	return {
		loadDataCenter: (tab, isInit, options) => dispatch(loadDataCenter(tab, isInit, options)),
	};
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(IndexContent);
