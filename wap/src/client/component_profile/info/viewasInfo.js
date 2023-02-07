import { connect } from 'react-redux';
import React, {Component} from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './viewas.css';
import Exenv from 'exenv';
import { viewAs } from 'src/client/actions/profile';

class ViewasInfo extends Component {
	constructor(props, context){
		super(props, context);
	}
	handleRemoveInfo() {

		Exenv.canUseDOM  && window.location.reload();

		/**
		 * connection 的結構太有問題了，所以只好強制reload
		 * 未來營運如果有時間再來調整吧（眼神死）
		 */
		// this.props.viewAs('self', 0);
		// this.props.close();
		// if (this.props.closeToReturn) {
		// 	this.props.history.goBack();
		// }
	}
	render() {

		return (
			<div styleName="viewas_info">
				<span styleName="remove_block">
					<i className="cross icon" styleName="remove" onClick={ this.handleRemoveInfo.bind(this) }></i>
				</span>
				<div styleName="content">
					<span className="main_text">{ this.props.profile.viewasInfo}</span>
					<a href="#" className="main_text" onClick={ this.handleRemoveInfo.bind(this) }>取消檢視</a>
				</div>
			</div>
		);
	}
}

function mapStateToProps (state, props) {
	return { profile: state.profile};
}

const ViewasInfoCss = CSSModules(ViewasInfo,css)
const ViewasInfoTranslate = translate([])(ViewasInfoCss);

export default connect(mapStateToProps, { viewAs })(ViewasInfoTranslate);