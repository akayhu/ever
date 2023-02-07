import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import CSSModules from 'react-css-modules';
import css from './index.css';
import compose from 'src/util/compose';
// actions
import { getNameCard } from 'src/client/actions/profile';
// components
import CardBody from './cardBody';
import Hover from 'src/client/component_common/hover';
import Image from 'src/client/component_common/image';

class NameCard extends PureComponent {
	constructor(props) {
		super();
		this.state = {
			showNameCard: false,
			nameCardData: null,
			subscribePeoples: { dataList: [] },
			subscribeLightBox: false,
			mutualFriendLightBox: false,
			mutualfriends: { dataList: [] },
		};
		this.getNameCardInfo = this.getNameCardInfo.bind(this);
	}

	getNameCardInfo({pid, targetPid}) {
		const { getNameCard } = this.props;
		return new Promise((resolve) => {
			getNameCard({targetPid}).then((res) => {
				if (res.response && !(res.response.hasOwnProperty('error') || res.response.hasOwnProperty('warning'))) {
					return resolve(res);
				}
				return 'error';
			});
		});
	}

	render() {
		const { userPid, targetPid, href, imgSrc, gtm, textMode, name, avatarSize, hiddenStatus, hide } = this.props;
		const imgStyle = { width: `${avatarSize}px`, height: `${avatarSize}px` };
		const idInfo = {pid: userPid, targetPid};
		let pass = false;

		if (userPid > 900000000 || targetPid > 900000000) {
			pass = true;
		}

		if (hiddenStatus === true) {
			pass = true;
		}

		return (
			<Hover
				pass={ pass || hide }
				WillShow={ CardBody }
				comProps={ {idInfo} }
				hoverAct={ this.getNameCardInfo }
				actParams={ {...idInfo} }
			>
				{
					textMode
					? <a href={ href }>{name}</a>
					: <a href={ href }>
						<Image
							{ ...gtm }
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

NameCard.defaultProps = {
	gtm: null,
	imgSrc: '',
	name: '',
	textMode: false,
	avatarSize: 40,
	hiddenStatus: false,
	hide: false
};

NameCard.propTypes = {
	targetPid: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]).isRequired,
	href: PropTypes.string.isRequired,
	imgSrc: PropTypes.string,
	name: PropTypes.string,
	gtm: PropTypes.object,
	textMode: PropTypes.bool,
	avatarSize: PropTypes.number,
	hide: PropTypes.bool,
};

function mapStateToProps(state){
	return {
		userPid: state.user.pid
	}
}


export default compose(
	connect(mapStateToProps, {getNameCard}),
	[CSSModules, '_', css, { allowMultiple: true }]
)(NameCard);
