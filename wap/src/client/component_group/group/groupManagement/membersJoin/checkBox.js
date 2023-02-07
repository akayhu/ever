import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import css from './index.css';
import compose from 'src/util/compose';
import CSSModules from 'react-css-modules';
// components
import { RadioGroup } from 'c_wap_module';

class CheckBox extends Component {
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
			<div styleName="checkbox-wrap">
        <input
          type="checkbox"
          onChange={ this.handleChange }
          checked={ toggled }
        />
        { label !== '' && <label>{ label }</label> }
      </div>
		)
	}
}

export default compose(
  //connect(null, { checkApplicant }),
  //translate([]),
  [CSSModules, '_', css, { allowMultiple: true }]
)(CheckBox)
