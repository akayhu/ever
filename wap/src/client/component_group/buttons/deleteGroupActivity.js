import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { deleteActivity } from 'src/client/actions/group';

class CheckMember extends Component {
  constructor(props) {
    super(props);
    this.onDeleteActivity = this.onDeleteActivity.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  onDeleteActivity() {
		const { params, act } = this.props;
    act(params)
	}

  render() {
    const { loading } = this.props;
    return (
  		<button
  			className={`ui button ${loading ? 'loading' : ''}`}
  			onClick={this.onDeleteActivity}
        disabled={loading}>
  			移除文章
  		</button>
    )
  }
}

CheckMember.propTypes = {
  params: PropTypes.object.isRequired,
  act: PropTypes.func.isRequired
}

export default CheckMember
