import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './style.css';

class AlertList extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { data, content, isEmpty } = this.props;
		if(isEmpty) return <div styleName="empty">尚未有任何通知</div>;
		if(!data.length) return <div className="ui loading" styleName="list_loading" />;
		return (
			<dl>
				{
					data.slice(0, 5).map((item, index) => (
						React.cloneElement(content, {
							key: index,
							...item
						})
					))
				}
			</dl>
		);
	}
}

AlertList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.any).isRequired,
	content: PropTypes.node.isRequired
};

export default CSSModules(AlertList, css);
