import React, { Component } from 'react';
import { Link } from 'react-router';
// import { translate } from 'react-i18next';
// import compose from 'src/util/compose';

class BlockItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const item = this.props.item;
		const css = this.props.css;

		return (
			(!item.hasOwnProperty("isShow")||(item.hasOwnProperty("isShow") && item.isShow === true)) &&
			<li className={css.item+(this.props.activeTab === item.itemKey?" "+css.on:"")}>
				{
					this.props.activeTab === item.itemKey &&
					<span className={item.className||""}>{item.title}{item.count>0&&"("+item.count+")"}</span>
				}
				{
					this.props.activeTab !== item.itemKey &&
					<Link className={item.className||""} to={item.url}>{item.title}{item.count>0&&"("+item.count+")"}</Link>
				}
	  	</li>
	  );
	}
}

export default BlockItem;
