import React from 'react';
import PropTypes from 'prop-types';
import clientConfig from 'src/configs/client';

let flag = false;
//https://jsbin.com/hewase/edit?html,js,console,output
function handleError(errorPoster="", e) {
	if (flag) return;
	flag = !flag;
	
	e.target.poster = errorPoster;
}

const Video = ({ src, errorPoster, ...rest}) => {
	return (
		<video
			controls
			src={ src }
			onError={ handleError.bind(null,  errorPoster) }
			{ ...rest }
		/>
	);
};

Video.defaultProps = {
	errorPoster: '//3.bp.blogspot.com/-eUsqosPeBEE/UzdH29anamI/AAAAAAAAJRk/QEyK2qGoQJY/s1600/error.png'
};

Video.propTypes = {
	src: PropTypes.string,
	errorPoster: PropTypes.string
};

export default Video;
