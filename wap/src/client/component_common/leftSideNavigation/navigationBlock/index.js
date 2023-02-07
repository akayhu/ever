import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import BlockList from '../blockList';
import compose from 'src/util/compose';

class NavigationBlock extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const blockData = this.props.blockData;
		const css = this.props.css;

		return (
			(!blockData.hasOwnProperty("isShow")||(blockData.hasOwnProperty("isShow") && blockData.isShow === true)) &&
			<div className={ css.block }>
				<h3 className={ css.h3 + (this.props.activeTab === blockData.itemKey ? ` ${css.on}` : '') }>
					{
						blockData.subItems.length > 0 && !blockData.itemKey &&
						<span className={blockData.className||""}>{blockData.title}</span>
					}
					{
						blockData.subItems.length > 0 && blockData.itemKey && this.props.activeTab === blockData.itemKey &&
						<span className={blockData.className||""}>{blockData.title}</span>
					}
					{
						blockData.subItems.length > 0 && blockData.itemKey && this.props.activeTab !== blockData.itemKey &&
						<Link className={blockData.className||""} to={ blockData.url }>{blockData.title}</Link>
					}
					{
						blockData.subItems.length === 0 && this.props.activeTab === blockData.itemKey &&
						<span className={blockData.className||""}>{blockData.title}</span>
					}
					{
						blockData.subItems.length === 0 && this.props.activeTab !== blockData.itemKey &&
						<Link className={blockData.className||""} to={ blockData.url }>{blockData.title}</Link>
					}
				</h3>
				{blockData.subItems.length > 0 && (<BlockList list={ blockData.subItems } { ...this.props } />)}
			</div>
		);
	}
}

export default NavigationBlock;
