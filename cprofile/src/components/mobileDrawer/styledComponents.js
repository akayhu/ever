import styled, { css } from 'styled-components';

export const MobileDrawerMain = styled.div`
	position: fixed;
	z-index: 1300;
	border-top: 1px solid #ddd;
	width: 100%;
	background-color: #fff;
	box-shadow: rgba(0, 0, 0, 0.16) 0px -1px 0px, rgba(0, 0, 0, 0.23) 0px -3px 5px;
	bottom: ${props => (props.height ? `-${props.height}px` : '-385px')};
	transition: bottom 0.3s;
	-moz-transition: bottom 0.3s;
	-webkit-transition: bottom 0.3s;
	-o-transition: bottom 0.3s;

	${props =>
		props.visible &&
		css`
			bottom: 0 !important;
		`}
`;
