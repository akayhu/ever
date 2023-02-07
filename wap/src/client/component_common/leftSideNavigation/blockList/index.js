import React, { Component } from 'react';
import { translate } from 'react-i18next';
import BlockItem from '../blockItem';
import compose from 'src/util/compose';

class BlockList extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		const list = this.props.list;
		const css = this.props.css;
		
		return (
			<ul className={css.list}>
				{list.map((item, index) => (
					<BlockItem key={index} item={item} {...this.props} />
				))}
	  	</ul>
	  );
	}
}

export default BlockList;

