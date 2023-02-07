import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'src/util/compose';
import { has } from 'lodash/object';
import { connectionReject, connectionAccept } from 'src/client/actions/connection';

class MailPage extends Component {
	constructor(props) {
		super(props);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleConnection = this.handleConnection.bind(this);
	}
  componentDidMount() {
    const { pid } = this.props.location.query;
    // 帳號登入者與mail上的pid連結為相同時才送api
    if (this.props.pid === pid) {
      this.handleConnection();
    } else {
      this.props.router.push("/error/404")
    }
  }
  handleConnection() {
    const { targetPid } = this.props.location.query;
    const action = this.props.location.pathname.split('/')[3];
    switch (action) {
      case 'accept': {
        // 同意交友邀請
        this.props.connectionAccept({targetPid}).then(res => {
          this.handleResponse(res, targetPid);
        })
        break;
      }
      case 'reject': {
        // 拒絕交友邀請
        this.props.connectionReject({targetPid}).then(res => {
          this.handleResponse(res, targetPid);
        })
        break;
      }
      default: {
        this.props.router.push("/error/404");
        break;
      }
    }
  }
  handleResponse({response}, targetPid) {
    if (has(response, 'warning') || !response) {
      return this.props.router.push("/error/404");      
    }
    return this.props.router.push(`/profile/${targetPid}`);
  }
	render() {
		return (
			<div></div>
		);
	}
}

function selector(state, props) {
  return {
    pid: state.user.pid
  }
}

export default compose(
  connect(selector, { connectionReject, connectionAccept }),
)(MailPage);
