import React from 'react';
import styled from 'styled-components';
import { Spin, Icon } from 'antd';

const LinkWrapper = styled.a`
	display: block;
`;

const WebAppBody = styled.div`
	width: 100%;
	min-height: 100vh;
	background: ${props => (props.background ? props.background : '#fff')};
`;

const BusinessCardAppBody = styled.div`
	width: 100%;
	background: #fff;
	height: 100%;
	position: absolute;
`;

const PaperAppContainer = styled.div`
	position: relative;
	margin: 0 auto;
	overflow: hidden;
	/* height: 100%; */
	padding-top: 50px;
	background: linear-gradient(to right, #f6f6f8, #c9c9c9);
	background: -moz-linear-gradient(to right, #f6f6f8, #c9c9c9);
	background: -webkit-linear-gradient(to right, #f6f6f8, #c9c9c9);
`;

const BusinessCardAppContainer = styled.div`
	position: relative;
	margin: 0 auto;
	height: 100%;
	padding-top: 50px;
	background: linear-gradient(to right, #f6f6f8, #c9c9c9);
	background: -moz-linear-gradient(to right, #f6f6f8, #c9c9c9);
	background: -webkit-linear-gradient(to right, #f6f6f8, #c9c9c9);
	overflow: auto;
`;

const WebAppContainer = styled.div`
	position: relative;
	margin: 0 auto;
	padding-top: 50px;
`;

const FullLoading = styled.div`
	position: absolute;
	width: 90%;
	margin: 0 5%;
	text-align: center;
	top: 40%;
	h3 {
		font-size: 25px;
	}
`;

const LightboxLoading = styled.div`
	position: relative;
	text-align: center;
	padding: 5em 2em;
`;

const StyledSpin = styled(Spin)`
	width: 100%;
	text-align: center;
	&::after {
		content: ' ';
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}
`;

const Loading = () => (
	<StyledSpin
		indicator={
			<Icon
				type="loading"
				style={{ fontSize: 30, color: '#f5b523', height: 30, width: 30 }}
				spin
			/>
		}
	/>
);

const Image = styled.img`
	width: ${props => props.width}px;
	height: ${props => props.height}px;
`;

const Hint = styled.p`
	font-size: 14px;
	margin: 0 auto;
	width: 100%;
	color: #ccc;
	text-align: center;
	&::after {
		content: ' ';
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}
`;

const CropImgMask = styled.div`
	position: absolute;
	top: 0;
	z-index: 11;
	height: 100%;
	width: 100%;
	${props => {
		switch (props.maskName) {
			case 'blackMask':
				return `
					background: rgba(0,0,0,${props.maskAlpha});
				`;
			case 'whiteMask':
				return `
					background: rgba(255,255,255,${props.maskAlpha});
				`;
			case 'blackGradientMask':
				return `
					background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(0,0,0,${
						props.maskAlpha
					}) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
					background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,${
						props.maskAlpha
					}) 100%); /* FF3.6-15 */
					background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(0,0,0,${
						props.maskAlpha
					}) 100%); /* Chrome10-25,Safari5.1-6 */
				`;
			case 'WhiteGradientMask':
				return `
					background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(255,255,255,${
						props.maskAlpha
					}) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
					background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(255,255,255,${
						props.maskAlpha
					}) 100%); /* FF3.6-15 */
					background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(255,255,255,${
						props.maskAlpha
					}) 100%); /* Chrome10-25,Safari5.1-6 */
				`;
			default:
				return `
					background: rgba(0,0,0,${props.maskAlpha});
				`;
		}
	}}
`;

const SubmitButton = styled.button`
	background-color: #f5b532;
	border: 1px solid #f5b532;
	color: #fff;
	font-weight: 500;
	padding: 3px 30px;
	border-radius: 20px;
	font-size: 16px;
	height: 40px;
`;

const SubmitButtonSmallSquare = styled.button`
	background-color: #f5b532;
	border: 1px solid #f5b532;
	color: #fff;
	font-weight: 500;
	padding: 3px 20px;
	border-radius: 5px;
	font-size: 14px;
	height: 34px;
	line-height: 1.6;
`;

const SubmitButtonFlat = styled.button`
	background-color: #f5b532;
	border: 1px solid #f5b532;
	color: #fff;
	font-weight: 500;
	padding: 3px 50px;
	border-radius: 20px;
	font-size: 14px;
	height: 34px;
`;

const SubmitButtonCollection = styled.button`
	background-color: #f5b532;
	border: 1px solid #f5b532;
	color: #fff;
	font-weight: 500;
	padding: 3px 38px;
	border-radius: 20px;
	font-size: 14px;
	height: 34px;
`;

const SubmitButtonCancelCollection = styled.button`
	background-color: #f5b532;
	border: 1px solid #f5b532;
	color: #fff;
	font-weight: 500;
	padding: 3px 25px;
	border-radius: 20px;
	font-size: 14px;
	height: 34px;
`;

const DisabledSubmitButton = styled.button`
	border: 1px solid #ccc;
	color: #fff;
	font-weight: 500;
	padding: 3px 30px;
	border-radius: 20px;
	font-size: 16px;
	background-color: #ccc;
	height: 40px;
`;

const GrayBorderButton = styled.button`
	padding: 3px 30px;
	border-radius: 28px;
	border: 1px solid #aeaeae;
	color: #484848;
	font-size: 16px;
	font-weight: 500;
	height: 40px;
`;

const GrayBorderButtonWhiteBackground = styled.button`
	padding: 3px 30px;
	border-radius: 28px;
	border: 1px solid #aeaeae;
	color: #484848;
	font-size: 16px;
	font-weight: 500;
	height: 40px;
	background-color: #fff;
`;

const GrayBorderButtonFlat = styled.button`
	padding: 3px 41px;
	border-radius: 28px;
	border: 1px solid #666;
	color: #484848;
	font-size: 14px;
	font-weight: 500;
	height: 34px;
	background-color: #fff;
`;

const ModalTitle = styled.h3`
	font-size: 20px;
	color: #333;
	text-align: left;
`;

const ModalButton = styled.button`
	display: inline-block;
	background-color: #f5a623;
	color: #fff;
	border-radius: 40px;
	height: 40px;
	padding: 0px 25px;
	margin: 10px auto;
	outline: 0;
	border: 0;
	font-weight: 500;
	font-size: 14px;
`;

export {
	Image,
	WebAppBody,
	PaperAppContainer,
	WebAppContainer,
	Loading,
	FullLoading,
	LightboxLoading,
	LinkWrapper,
	BusinessCardAppContainer,
	BusinessCardAppBody,
	Hint,
	CropImgMask,
	SubmitButton,
	DisabledSubmitButton,
	GrayBorderButton,
	ModalTitle,
	ModalButton,
	SubmitButtonFlat,
	GrayBorderButtonFlat,
	SubmitButtonSmallSquare,
	GrayBorderButtonWhiteBackground,
	SubmitButtonCollection,
	SubmitButtonCancelCollection,
};
