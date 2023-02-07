import styled from 'styled-components';

export const NoviceGuideMain = styled.div`
	width: 600px;
	position: relative;
	top: 50%;
	left: 50%;
	margin-left: -300px;
	margin-top: -300px;
	background-color: #fff;
	border-radius: 10px;

	@media only screen and (max-width: 600px) {
		width: 500px;
		margin-left: -250px;
	}

	@media only screen and (max-width: 533px) {
		width: 400px;
		margin-left: -200px;
	}

	@media only screen and (max-width: 414px) {
		width: 300px;
		margin-left: -150px;
		margin-top: -230px;
	}
`;

export const NoviceGuideSlider = styled.div`
	width: 600px;
	overflow: hidden;
	position: relative;
	border-radius: 10px;

	.wrapper {
		-webkit-transition: 0.3s all linear;
		transition: 0.3s all linear;
		will-change: transform;
	}

	.each-slide {
		width: 600px;
		float: left;
		text-align: center;
		background-size: cover;
		background-position: center center;
		background-color: transparent;
	}

	@media only screen and (max-width: 600px) {
		width: 500px;

		.each-slide {
			width: 500px;
		}
	}

	@media only screen and (max-width: 533px) {
		width: 400px;

		.each-slide {
			width: 400px;
		}
	}

	@media only screen and (max-width: 414px) {
		width: 300px;

		.each-slide {
			width: 300px;
		}
	}
`;

export const SetSliderStyles = styled.div`
	width: ${props => `${props.slidesLength * 600}px`};
	transform: ${props => `translateX(${props.active * -600}px)`};

	@media only screen and (max-width: 600px) {
		width: ${props => `${props.slidesLength * 500}px`};
		transform: ${props => `translateX(${props.active * -500}px)`};
	}

	@media only screen and (max-width: 533px) {
		width: ${props => `${props.slidesLength * 400}px`};
		transform: ${props => `translateX(${props.active * -400}px)`};
	}

	@media only screen and (max-width: 414px) {
		width: ${props => `${props.slidesLength * 300}px`};
		transform: ${props => `translateX(${props.active * -300}px)`};
	}
`;
