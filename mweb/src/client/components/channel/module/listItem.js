import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './listItem.css';
import compose from 'src/util/compose';
import Image from 'src/client/components/image';
import { Link } from 'react-router';

class ListItem extends Component {
	constructor( props, context ){
		super( props, context );
	}
	render() {
		const { data } = this.props;

		return (
			<dd styleName="group_item" key={data.id}>
				<Link to={"/m/group/"+data.id} >
					<div styleName="image_wrap" >
						<Image
							src={ data.coverWebUrl }
							type="cover"
							domain="group"
						/>
					</div>
					<div styleName="group_content">
						<div styleName="group_title">
							<h3>{ data.name }</h3>
							<span styleName="group_members">{ data.memberCount }名成員</span>
						</div>
						<div styleName="group_text">
							<a href="#">{ data.description }</a>
						</div>
					</div>
				</Link>
			</dd>
		);
	}
}

// function mapStateToProps(state, props) {
// 	return {
// 		group: state.entities.channels,
// 		// dataList: state.group[props.type].byGroup[props.tabName].dataList,
// 		// total: state.group[props.type].byGroup[props.tabName].total,
// 		// loading: state.group[props.type].byGroup[props.tabName].loading,
// 		// error: state.group[props.type].byGroup[props.tabName].error,
// 		// end: state.group[props.type].byGroup[props.tabName].end
// 	};
// }

export default compose(
	// connect( mapStateToProps, { changeGroupTab }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ListItem);

