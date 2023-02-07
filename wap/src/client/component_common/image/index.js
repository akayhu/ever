import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clientConfig from 'src/configs/client';
import pure from 'recompose/pure';

const imgMap = {
	avatar: {
		profile: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultProfileAvatar.png`},
		company: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultProfileAvatar.png`},
		channel: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultMediaAvatar.png`},
		group: {src: `${clientConfig.params.staticWapUrl}/images/avatar/defaultGroupAvatar.png`}
	},
	cover: {
		profile: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultProfileCover.png`},
		company: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultProfileCover.png`},
		channel: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultMediaCover.png`},
		group: {src: `${clientConfig.params.staticWapUrl}/images/cover/defaultGroupCover.png`}
	},
	topic: {
		gallery: {src: `${clientConfig.params.staticWapUrl}/images/topic/defaultTopicGallery.png`}
	},
	company: {
		profile: {src: `${clientConfig.params.staticWapUrl}/images/company_logo.jpg`},
	},
	error: {
		404: {src: `${clientConfig.params.staticWapUrl}/images/bg_404.png`}
	}
};

class Image extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: false
		}
		this.showImg = null;
		this.retryTime = 0;
		this.maxRetryTime = 10;
		this.getDefaultImg = this.getDefaultImg.bind(this);
		this.handleError = this.handleError.bind(this);
	}

	// componentDidMount() {
	// 	this.showImg.on('load',()=>{
	// 		this.setState({
	// 			loading: false
	// 		})
	// 	})
	// }
	
	getDefaultImg() {
		if (imgMap.hasOwnProperty(this.props.type)) {
			return imgMap[this.props.type][this.props.domain].src;
		}

		return this.props.errorImg || imgMap.error['404'].src;
	}
	handleError(e) {

		// this.setState({
		// 	loading: true
		// })

		if(this.props.retry === true && this.retryTime < this.maxRetryTime){
			setTimeout(() => {
				this.retryTime++;
	      this.showImg.src = this.props.src;
	    }, 1000);
	    return;
		}

		let errorImg = this.props.errorSrc;

		if (!errorImg) {
			errorImg = this.getDefaultImg();
		}

		e.target.src = errorImg;
	}
	render() {
		let {type, domain = 'profile', src, errorImg, retry, title, ...rest} = this.props;
		let imgSrc = src;

		if (!imgSrc) {
			imgSrc = this.getDefaultImg();
		}
		
		return (
			<img
				className={ this.props.className }
				src={ imgSrc }
				ref={ _ref => this.showImg = _ref }
				onError={ this.handleError }
				{ ...rest }
			/>
		);
	}
}

Image.defaultProps = {
	type: 'avatar',
	domain: 'profile',
	errorImg: ''
};

Image.propTypes = {
	src: PropTypes.string,
	type: PropTypes.string,
	domain: PropTypes.string,
	errorImg: PropTypes.string,
};

export default pure(Image);
