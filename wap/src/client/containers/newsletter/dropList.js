import React from 'react';
import PropTypes from 'prop-types';
import { DropList } from 'c_wap_module';

class OptionList extends React.Component {
	constructor() {
		super();
		this.onSelect = valueObj => this.selected(valueObj);
	}
	selected(valueObj) {
		this.props.onSelect(this.props.keyName, valueObj.value);
	}
	render() {
		const { text, option, defaultIndex } = this.props;
		return (
			<tr>
				<td>{ text }</td>
				<td>
					<DropList
						listContent={ option }
						onSelected={ this.onSelect }
						defaultIndex={ defaultIndex }
					/>
				</td>
			</tr>
		);
	}
}

DropList.propTypes = {
	text: PropTypes.string,
	option: PropTypes.array,
	onSelect: PropTypes.func,
	defaultIndex: PropTypes.number
};

export default OptionList;
