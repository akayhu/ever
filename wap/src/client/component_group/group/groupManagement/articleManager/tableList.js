import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import css from './index.css';
// components
import ListItem from './listItem';

class TableList extends Component {
	constructor(props){
		super(props);
	}

	renderSortIcon() {
		const { sortInfo: {sortOrder} } = this.props;
		if (sortOrder === 1) return <i className="caret up icon"></i>
		if (sortOrder === -1)  return <i className="caret down icon"></i>
		return null
	}
	render() {
		const { listData, onTitleClick, tableHead, sortInfo: { sortField }, isLoading } = this.props;
		return (
			<div>
	      <table styleName="table_box">
	        <tbody>
	          <tr styleName="table_title">
	            {
	            	tableHead.map((item, index) => {
		              if (item.sortBy) {
		              	const sortIcon = sortField === item.sortBy && this.renderSortIcon();
		              	
		                return (
		                  <th key={index} onClick={onTitleClick.bind(this, item.sortBy)} styleName={"cursor" + (sortIcon?"":"") } >
		                    {item.name}
		                    {sortIcon}
		                  </th>
		                )
		              }
		              
	              	return <th key={index}>{item.name || ''}</th>
	            	})
	            }
	          </tr>
	          {
	          	listData.map((activity, index) => (
		            <ListItem
		              {...activity}
		              key={ index }
		            />
	          	))
	          }
	        </tbody>
	      </table>
				{
					(!listData.length && isLoading) &&
					<div className="ui loading" style={{top: '15px'}}></div>
				}
			</div>
		);
	}
}

TableList.propTypes = {
  listData: PropTypes.array.isRequired,
  sortInfo: PropTypes.object.isRequired,
  tableHead: PropTypes.array.isRequired,
  onTitleClick: PropTypes.func.isRequired
}

export default compose(
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(TableList)
