import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { Link } from 'react-router';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { getGroupInfo } from 'src/client/actions/group';
// components
import Hover from 'src/client/component_common/hover';
import Image from 'src/client/component_common/image';
import CardBody from './cardBody';

class GroupCard extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { id, name, textMode, imgSrc, avatarSize, pass } = this.props;
		const imgStyle = { width: `${avatarSize}px`, height: `${avatarSize}px` };
		return (
			<Hover
				pass={ pass }
				cardHeight={ 210 }
				cardWidth={ 430 }
				WillShow={ CardBody }
				hoverAct={ this.props.getGroupInfo }
				actParams={ {channelId: this.props.id} }
			>
				{
					textMode
					? <a href={ `/group/${id}` }>{name}</a>
					: <a href={ `/group/${id}` }>
							<Image
								type='avatar'
								domain={ 'group' }
								src={ imgSrc }
								title={ name }
								style={ imgStyle }
								styleName="img"
							/>
						</a>
				}
			</Hover>
		);
	}
}

GroupCard.defaultProps = {
	gtm: null,
	imgSrc: '',
	name: '',
	textMode: false,
	avatarSize: 40,
	pass: false
};

GroupCard.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired
};

export default compose(
	connect(null, {getGroupInfo}),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(GroupCard);
