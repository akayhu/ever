import React, { Component } from 'react';
import { connect } from 'react-redux';
import Step3 from './step3';
import { getGroupInfo } from 'src/client/actions/group';

class Step3Wrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: props.groupInfo,
      error: ''
    }
  }
  componentDidMount() {
    const { groupInfo } = this.state;
    if (!groupInfo) {
      const { channelId, getGroupInfo } = this.props;
      getGroupInfo({channelId}).then(res => {
        if (res.response) {
          this.setState({groupInfo: res.response});
        } else {
          this.setState({error: res});
        }
      });
    }
  }
  render() {
    const { groupInfo, error } = this.state;
    // 如果重通知列表過來的話會沒有groupInfo
    if (!groupInfo) {
      const loadStyle = { position: 'relative', top: 40 };
      return (
        <div style={ loadStyle }>
          <div className="ui loading"></div>
        </div>
      )
    }

    if (error) {
      const errorStyle = { position: 'relative', top: 40, color: '#ff530d'};
      return (
        <div style={ errorStyle }>{error}</div>
      )
    }

    return (
      <Step3
        {...this.props}
        groupInfo={ groupInfo }
      />
    )
  }

}

export default connect(null, {getGroupInfo})(Step3Wrapper);
