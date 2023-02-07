import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
//import CSSModules from 'react-css-modules';
import { getBCMsgList } from 'src/client/reducers/selectors';
import LazyLoading from 'src/client/component_common/lazyLoad/list';
import MessageListItem from 'src/client/component_message/bc/messageListItem';

class LeftSideNavigation extends Component {
	constructor(props) {
		super(props);
    
    this.state = {
      focus : null
    };
    
    this.index = 1;
	}
  handleClick(jobNo) {
    this.setState({
      focus: jobNo
    });
    this.props.handleClick(jobNo);
  }
  loadMore() {
    this.index++;
    //this.props.loadDataByCategory('messageList');
  }
	render() {
		return (
      <LazyLoading loadingAct={ this.loadMore.bind(this) }>
        <div>
          <dl index={this.index}>
            {
              this.props.messageList.map((item, key) => (
                <MessageListItem
                  key={ item.jobNo }
                  focus={this.state.focus}
                  handleClick={ this.handleClick.bind(this, item.jobNo ) }
                  { ...item }
                />
              ))
            }
          </dl>
        </div>
      </LazyLoading>
		);
	}
}

function mapStateToProps(state) {
  return {
    messageList: getBCMsgList(state)
  };
}

export default compose(
    connect(mapStateToProps),
    //translate([]),
    //[CSSModules, '_', css, { allowMultiple: true }]
  )(LeftSideNavigation);
