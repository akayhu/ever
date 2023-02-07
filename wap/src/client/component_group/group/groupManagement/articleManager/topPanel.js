import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';

// components
import { CheckBox, DeleteGroupActivity } from 'src/client/component_group/buttons';
import { LightBox } from 'c_wap_module';

class TopPanel extends Component {
	constructor(props){
		super(props);
	}
	render() {
		const {isLoading, message, showAlertLB, closeLB, onButtonClick, params} = this.props;
		return (
      <div styleName="top_panel">
        { showAlertLB &&
					<LightBox option={{closeIcon: true}} onClose={ closeLB }>
	    			<div>{ message }</div>
	    		</LightBox>
				}
        {/* <CheckBox
          toggled={ checkAll }
          toggleAction={ checkAllActivities }
          label="全選"
        /> */}
        {isLoading &&
          <div className='ui loading' styleName='batch_act_block'></div>
        }
        {message &&
          <div styleName='batch_act_block'>
            { message }
          </div>
        }
        <button
          className="ui normal button"
					styleName="top_panel_button"
          onClick={ onButtonClick.bind(this, params) }
          >
          批次移除文章
        </button>
      </div>
		);
	}
}

TopPanel.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	message: PropTypes.string.isRequired,
	showAlertLB: PropTypes.bool.isRequired,
	closeLB: PropTypes.func.isRequired,
	onButtonClick: PropTypes.func.isRequired,
	params: PropTypes.number.isRequired //channelId
}

export default compose(
	//translate( [] ),
	[CSSModules, '_', css, { allowMultiple: true }]
)(TopPanel)
