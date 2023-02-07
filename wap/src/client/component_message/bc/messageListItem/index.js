import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import clientConfig from 'src/configs/client';
import css from './index.css';
import compose from 'src/util/compose';

class MessageListItem extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isReading: false
		};
	}
	/*componentWillReceiveProps(nextProps) {
		if (nextProps.readingChatId !== this.props.readingChatId) {
			this.setState({ isReading: this.props.chatId === nextProps.readingChatId});
		}
	}*/
	handleClick() {
		this.setState({
			isReading: true
		});
		this.props.handleClick(this.props.jobNo);
	}
	render() {
		let readStyle;
    const { isRead, jobName, inputDate, custName, jobNo } = this.props;

    if(isRead === 1){
      readStyle = '';
    }else if(this.state.isReading === true){
    	readStyle = '';
    }else{
      readStyle = 'unread';
    }
    
    if(jobNo === this.focus){
      readStyle = 'focus';
    }

		return (
			<dd className={css.item} styleName={ readStyle } onClick={ this.handleClick.bind(this) }>
        <div styleName="summary">
          <span styleName="job">{ jobName }</span>
          <span styleName="time">{ inputDate.split(' ', 1) }</span>
        </div>
        <div styleName="company">{ custName }</div>
      </dd> 
		);
	}
}

/*
function mapStateToProps(state) {
	return {
		readingChatId: state.message.readingChatId,
	};
}
*/

export default compose(
	//connect(mapStateToProps),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MessageListItem);
