import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { verifySingleMember } from 'src/client/actions/group';

class CheckMember extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  onVerifyGroupMember(isPass) {
		const { pid, channelId, verifySingleMember, onVerify } = this.props;
    onVerify();
    verifySingleMember([pid], channelId, isPass)
      .then(success => onVerify(success));
	}

  render() {
    const { loading } = this.props;
    return (
      <div>
				<button
					className={`ui primary button ${loading ? 'loading' : ''}`}
					onClick={this.onVerifyGroupMember.bind(this, true)}
          disabled={loading}>
					核准加入
				</button>
				<button
					className={`ui button ${loading ? 'loading' : ''}`}
					onClick={this.onVerifyGroupMember.bind(this, false)}
          disabled={loading}>
					拒絕
				</button>
			</div>
    )
  }
}

export default compose(
	connect(null, { verifySingleMember }),
	//translate([])
)(CheckMember)
