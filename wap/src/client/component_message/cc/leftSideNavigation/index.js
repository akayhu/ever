import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import { getDataList, getIsLoading } from 'src/client/reducers/message/selectors';
import { loadDataByCategory } from 'src/client/actions/message';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import MessageListItem from 'src/client/component_message/cc/messageListItem';
import Loading from 'src/client/component_message/loading';

//import css from './index.css';

class LeftSideNavigation extends Component {
	constructor(props) {
		super(props);
    
    this.state = {
      focus : props.readingChatId || null
    };
	}
  componentWillReceiveProps(nextProps) {
    if(this.state.focus !== nextProps.readingChatId ) {
      this.setState({
        focus: nextProps.readingChatId
      })
    }
  }
  
  handleClick(chatId) {
    this.setState({
      focus: chatId
    });
    this.props.handleClick(chatId);
  }
  loadMore() {
    this.props.loadDataByCategory('messageList');
  }
	render() {
		return (
      <LazyLoading loadingAct={ this.loadMore.bind(this) }>
        <div>
          <dl>
            {
              this.props.messageList.map(item => (
                <MessageListItem
                  key={ item.chatId }
                  focus={this.state.focus}
                  handleClick={ this.handleClick.bind(this, item.chatId ) }
                  { ...item }
                />
              ))
            }
            {this.props.loading && <Loading />}
          </dl>
        </div>
      </LazyLoading>
		);
	}
}

function mapStateToProps(state) {
  const nowState = state.message;
  
  return {
    messageList: getDataList(nowState, 'messageList'),
    loading: getIsLoading(nowState, 'messageList'),
    readingChatId: state.message.readingChatId
  };
}

export default compose(
    connect(mapStateToProps, {loadDataByCategory}),
    //translate([]),
    //[CSSModules, '_', css, { allowMultiple: true }]
  )(LeftSideNavigation);
