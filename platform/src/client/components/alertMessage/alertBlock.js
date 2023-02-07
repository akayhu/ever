import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { clearAlert, lockClear } from '../../actions/alert';
import css from './index.css';
import clientConfig from '../../../configs/client';

class AlertBlock extends Component {
	constructor(props, context) {
		super(props, context);
		
		this.state = {
			className: ''
		};
		this.goodbyeTime = 5500;
		this.removeTime = 1500;
		this.mounted = false;
	}
	
	componentDidMount() {
		this.mounted = true;
		this.setState({
			className: css.pullDown
		})
	}
	
	componentWillUnmount() {
		this.mounted = false;
	}
	
	handleClose() {
		this.props.lockClear();
		
		if(this.mounted){
			this.setState({
				className: css.fadeOut
			});
		}
		
		setTimeout(() => {
			this.props.clearAlert(this.props.data.elemId);
		}, this.removeTime)
	}
	
	render() {
		
		setTimeout(() => {
			this.handleClose();
		}, this.goodbyeTime)
		
		return (
			<div styleName="message_block" className={this.state.className + " " + (this.props.data.fromAction?css.msg_style:"")}>
				{['dev','lab'].indexOf(clientConfig.env) !== -1 && this.props.data.realMessage && <div style={{width: '100%', margin: '0 auto'}}>This is Dev Env Only</div>}
				{['dev','lab'].indexOf(clientConfig.env) !== -1 && this.props.data.realMessage && <div style={{width: '100%', margin: '0 auto'}}>Error code : {this.props.data.code}</div>}
				{['dev','lab'].indexOf(clientConfig.env) !== -1 && this.props.data.realMessage && <div style={{width: '100%', margin: '0 auto'}}>Error message : {this.props.data.realMessage}</div>}
				{['dev','lab'].indexOf(clientConfig.env) !== -1 && this.props.data.realMessage && <div style={{width: '100%', margin: '0 auto 10px'}}>Action type : {this.props.data.title}</div>}
				{this.props.data.message || "我們有話想跟你說，但似乎是忘記打了！"}
				{!this.props.data.message && <a href={clientConfig.params.e104Url+'/question_admin/reaction.cfm?faq_from=plus&np=MjYzMTYzNg'} target="_blank">回報問題</a>}
				<span styleName="remove_block">
					<i className="cross icon" styleName="remove" onClick={ this.handleClose.bind(this) }></i>
				</span>
			</div>
		);
	}
}

const AlertBlockCSS = CSSModules( AlertBlock, css, { allowMultiple: true } );

export default connect(null, { clearAlert, lockClear })(AlertBlockCSS);
