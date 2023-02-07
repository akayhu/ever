import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
	position: relative;
	top: 40px;
	text-align: center;
	background: #f0f0f0;
	height: calc(100vh - 40px);
	::after {
		content: '';
		height: 100%;
		width: 0;
		display: inline-block;
		vertical-align: middle;
	}
`;

export const Field = styled.div`
	width: 90%;
	margin: 0 auto;
	display: inline-block;
	vertical-align: middle;
`;

export const Title = styled.div`
	position: absolute;
	font-size: 36px;
	font-weight: 400;
	color: #2b2b2b;
	top: 32%;
	left: ${props => (props.paramsCode === '500' ? '17%' : '7%')};

	@media (max-width: 414px) {
		font-size: 26px;
	}
`;

export const SubTitle = styled.div`
	font-size: 16px;
	color: #666;
	text-align: center;
	margin-top: 50px;

	@media (max-width: 414px) {
		margin-top: 10px;
	}
`;

export const Description = styled.p`
	font-size: 1em;
	color: #333;
	margin-top: 1em;
`;

export const StyledLink = styled(Link)`
	color: #f5a623;
	:hover {
		color: #f5a623;
		text-decoration: underline;
	}
`;

export const Cover = styled.div`
	margin: 0 auto;
	width: 413px;
	height: 168px;
	position: relative;
	background-image: ${props => `url(${props.bgImage})`};
	background-repeat: no-repeat;
	background-size: 413px;

	@media (max-width: 414px) {
		width: 320px;
		height: 140px;
		background-size: 320px;
	}

	@media (max-width: 320px) {
		width: 300px;
		background-size: 300px;
	}
`;
