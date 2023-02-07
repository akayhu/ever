import { connect } from 'react-redux';
import React, {Component} from 'react';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './viewas.css';

import { viewAs } from 'src/client/actions/profile';

class InvisibleInfo extends Component {
	constructor(props, context){
		super(props, context);
	}
	componentDidMount() {
		this.props.viewAs('self', 2);
	}
	handleRemoveInfo() {
		// this.props.viewAs('self', false);
	}
	render() {

		return (
			<div styleName="viewas_info">
				<div styleName="content">
					<span className="main_text">
						你目前狀態為隱身，僅能瀏覽文章，其他會員看不到你，也無法與你進行互動
					</span>
					<a href="javascript:;" className="main_text" onClick={ this.handleRemoveInfo.bind(this) }>解除隱身</a>
				</div>
			</div>
		);
	}
}

function mapStateToProps (state, props) {
	return { profile: state.profile};
}

const InvisibleInfoCss = CSSModules(InvisibleInfo, css)
const InvisibleInfoTranslate = translate([])(InvisibleInfoCss);

export default connect(mapStateToProps, { viewAs })(InvisibleInfoTranslate);