import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

class ImageLazyLoad extends Component {
	constructor( props, context ){
		super( props, context );
		this.state = {
			showImage: false
		};
	}

	componentWillMount(){
		// allow image display override
	    if (this.state.showImage) {
	      this.setShowImage(true);
	    }
	}

	componentDidUpdate(prevProps){
		if (! this.state.showImage && prevProps.viewPort) {
	      this.updatePosition();
	    }
	}

	updateImagePosition(top, height){
		// image is already displayed, no need to check anything
	    if (this.state.showImage) {
	      return;
	    }

	    // update showImage state if component element is in the viewport
	    var min = this.props.viewPort.top;
	    var max = this.props.viewPort.top + this.props.viewPort.height;

	    if ((min <= (top + height) && top <= max)) {
	      this.setShowImage(true);
	    }
	}

	setShowImage(show){
		this.setState({
	      showImage: !!(show)
	    });
	}

	updatePosition(){
		let el = this.refs['imgLoad']; 
    	this.updateImagePosition(el.offsetTop, el.offsetHeight);
	}

	render() {
		let img = this.state.showImage ? this.props.image : this.props.loader;
		return (
			<img 
				ref="imgLoad"
		 		src={img} 
				viewPort={this.props.viewPort} 
				showImage={this.state.showImage}
				updateImagePosition={this.updateImagePosition.bind(this)} 
			/>
		);
	}
}

ImageLazyLoad.defaultProps = {
	loader: '',
  showImage: false
};

export default compose(
	//connect(mapStateToProps),
	//translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(ImageLazyLoad);