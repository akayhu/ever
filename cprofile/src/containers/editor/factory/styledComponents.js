import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import mobileBorder from 'components/defaultSmallImage/mobile_project_thumbnail_bg.png';
import border from 'components/defaultSmallImage/project_thumbnail_bg.png';

export const TemplateContainer = styled.div`
	padding: 5px;
	margin-bottom: ${isMobile ? '0' : '50px'};
`;

export const BorderBoxHover = styled.div`
	position: absolute;
	width: 99%;
	height: ${isMobile ? '95%' : '97%'};
	z-index: 10;
	background-color: #000;
	opacity: 0.1;
	top: 0;
	display: none;
`;

export const BorderBox = styled.div`
	background: url(${isMobile ? mobileBorder : border}) no-repeat;
	background-size: 100%;
	padding: ${isMobile ? `18px 2px 7px 0` : `14px 2px 5px 2px`};
	margin-bottom: ${isMobile ? '4px' : '15px'};
	width: 100%;
	cursor: pointer;
	position: relative;
	z-index: 9;

	:hover ${BorderBoxHover} {
		display: block;
	}
`;

export const BorderBoxSelect = styled.div`
	position: absolute;
	z-index: 11;
	height: ${isMobile ? '99px' : '155px'};
	top: 0;
	img {
		width: 100%;
	}
`;

export const Template = styled.div`
	background: url(${props => props.image}) no-repeat;
	background-size: contain;
	background-position: center;
	height: ${isMobile ? '78px' : '140px'};
	margin: 0 auto;
	width: 100%;
`;

export const TemplatePreview = styled.img`
	width: 100%;
	cursor: default;
`;

export const PreviewContainer = styled.div`
	text-align: center;
`;

export const CustomSelected = styled.div`
	border-bottom: 1px solid #eaeaea;
	border-top: 1px solid #eaeaea;
	padding: 10px 20px;
	background: #f6f6f6;
	margin-bottom: 15px;
`;

export const CustomSelectedEmpty = styled.p`
	padding: 0px 20px;
	color: #999;
`;
