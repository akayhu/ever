import React, { Component } from 'react';
import { connect } from 'react-redux';
import client from '../../../configs/client';
import { LightBox } from 'c_wap_module';
import { setDirectPanel } from '../../actions/alert';

class DirectPanel extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeLightBox = this.closeLightBox.bind(this);
  }
  handleSubmit() {
    this.props.setDirectPanel(false);
    document.location.href = `${client.params.rootPath}/sso/saml-login`;
  }
  closeLightBox() {
    this.props.setDirectPanel(false);
  }
  render() {
    const haveLoginLightboxOption = { closeIcon: false };
    return (
      <LightBox option={ haveLoginLightboxOption } onClose={ this.closeLightBox }>
        <h3>此為會員功能，請先登入</h3>
        <button className="ui primary button" data-gtm-common="Dialog - 我要登入" onClick={ this.handleSubmit }>我要登入</button>
				<button onClick={ this.closeLightBox } data-gtm-common="Dialog - 稍後再說">稍後再說</button>
      </LightBox>
    )
  }
}

export default connect(null, {setDirectPanel})(DirectPanel);