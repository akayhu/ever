import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import { Link } from 'react-router';
import css from './index.css';
// actions
import { getMediaInfo } from 'src/client/actions/channel/channel_api';
// components
import Hover from 'src/client/component_common/hover';
import Image from 'src/client/component_common/image';
import CardBody from './cardBody';

class ChannelCard extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { id, name, textMode, imgSrc, avatarSize } = this.props;
		const imgStyle = { width: `${avatarSize}px`, height: `${avatarSize}px` };
		return (
				<div styleName="channel_card">
			{/*<Hover
				cardHeight={ 380 }
				cardWidth={ 430 }
				WillShow={ CardBody }
				hoverAct={ this.props.getMediaInfo }
				actParams={ {channelId: id} }
			>*/}
				{/*<Link to={ `/channel/${id}` }>
					{ name }
				</Link>*/}
				{
					textMode
					? <a href={ `/channel/${id}` }>{name}</a>
					: <a href={ `/channel/${id}` }>
							<Image
								type='avatar'
								domain={ 'channel' }
								src={ imgSrc }
								title={ name }
								style={ imgStyle }
								styleName="img"
							/>
						</a>
				}
			{/* </Hover>*/}
			</div>
		);
	}
}

ChannelCard.defaultProps = {
	gtm: null,
	imgSrc: '',
	name: '',
	textMode: false,
	avatarSize: 40
};

ChannelCard.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired
};

export default compose(
	connect(null, {getMediaInfo}),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ChannelCard);
