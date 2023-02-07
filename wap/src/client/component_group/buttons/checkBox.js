import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin'
// components
import { RadioGroup } from 'c_wap_module';

export default class CheckBox extends Component {
	constructor(props) {
		super(props);
    this.state = {
      checked: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
	}
  handleChange() {
    const { value, toggleAction } = this.props;
    toggleAction(value);
  }
	render() {
		const { label = '', toggled } = this.props;
		return (
			<div style={{display: 'flex', alignItems: 'center'}}>
        <input
          type="checkbox"
          onChange={ this.handleChange }
          checked={ toggled }
          style={{ margin: '0 10px 0 0' }}
        />
        { label !== '' && <label style={{marginBottom: '0px'}}>{ label }</label> }
      </div>
		)
	}
}

CheckBox.propTypes = {
  label: PropTypes.string,
  toggled: PropTypes.bool.isRequired,
  toggleAction: PropTypes.func.isRequired
}
