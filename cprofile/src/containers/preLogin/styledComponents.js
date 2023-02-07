import styled, { css } from 'styled-components';

export const SectionOne = styled.section`
	height: 1750px;
	text-align: center;
	width: 100%;

	@media only screen and (min-width: 901px) {
		${({ sectionValue }) =>
			sectionValue > 350 &&
			sectionValue < 1201 &&
			css`
				position: fixed;
				top: -300px;
			`}

		${({ sectionValue }) =>
			sectionValue > 1201 &&
			css`
				position: fixed;
				top: ${({ sectionValue }) => `${890 - sectionValue}px`};
			`}
	}

	@media only screen and (max-width: 900px) {
		${({ sectionValue }) =>
			sectionValue > 330 &&
			sectionValue < 1081 &&
			css`
				position: fixed;
				top: -280px;
			`}

		${({ sectionValue }) =>
			sectionValue > 1081 &&
			css`
				position: fixed;
				top: ${({ sectionValue }) => `${806 - sectionValue}px`};
			`}
	}

	@media only screen and (max-width: 731px) {
		height: auto;
		padding-bottom: 80px;
		position: initial;
		top: auto;
	}
`;

export const HomePageImgIn = styled.div`
	position: absolute;
	left: 50%;
	top: 56px;
	margin-left: -298px;
	z-index: 10;

	@media only screen and (min-width: 901px) {
		${({ imgInTopValue }) =>
			imgInTopValue > 370 &&
			css`
				transform: ${({ imgInTopValue }) =>
					`translate3d(0px, ${370 - imgInTopValue}px, 0px)`};
			`}
	}

	@media only screen and (max-width: 950px) {
		top: 54px;
		margin-left: -286px;
	}

	@media only screen and (max-width: 900px) {
		top: 51px;
		margin-left: -270px;
		${({ imgInTopValue }) =>
			imgInTopValue > 430 &&
			css`
				transform: ${({ imgInTopValue }) =>
					`translate3d(0px, ${430 - imgInTopValue}px, 0px)`};
			`}
	}

	@media only screen and (max-width: 854px) {
		top: 48px;
		margin-left: -253px;
	}

	@media only screen and (max-width: 812px) {
		top: 42px;
		margin-left: -222px;
		${({ imgInTopValue }) =>
			imgInTopValue > 460 &&
			css`
				transform: ${({ imgInTopValue }) =>
					`translate3d(0px, ${460 - imgInTopValue}px, 0px)`};
			`}
	}
`;
