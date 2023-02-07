import styled from 'styled-components';

export const UserName = styled.div`
	@media (max-width: 414px) {
		> div {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			word-break: break-all;
			max-width: 165px;
		}
	}
	@media (max-width: 375px) {
		max-width: 126px;
	}
	@media (max-width: 320px) {
		max-width: 65px;
	}
`;

export const Container = styled.header`
	top: 0;
	position: fixed;
	width: 100%;
	background: #fff;
	height: 50px;
	box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.28);
	z-index: 2001;
	font-size: 20px;
	color: #5e5e5e;
	display: flex;
	justify-content: space-between;
`;

export const Content = styled.div`
	line-height: 40px;
`;

export const Logo = styled.div`
	margin: 3px 127px 0 10px;
	float: left;

	@media (max-width: 375px) {
		margin: 8px 127px 0 10px;
	}

	@media (max-width: 320px) {
		img {
			width: 120px;
			height: auto;
		}
	}
`;

export const ContentMobile = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`;

export const LoginButton = styled.a`
	width: 80px;
	height: 40px;
	border-radius: 27px;
	background-color: #f5b532;
	text-align: center;
	font-size: 16px;
	color: #fff;
	font-weight: 500;
	line-height: 2.4;
	margin-top: 5px;
	margin-right: 15px;
	-webkit-letter-spacing: 1px;
	-moz-letter-spacing: 1px;
	-ms-letter-spacing: 1px;
	letter-spacing: 1px;
	border: 1px solid #f5b532;

	:hover {
		color: #fff;
	}

	@media (max-width: 320px) {
		width: auto;
		padding: 0 19px;
	}
`;

export const ContentMain = styled.div`
	display: flex;
	float: left;
`;

export const ContentItem = styled.span`
	font-size: 16px;
	color: ${props => (props.select ? '#f5b523' : '#5e5e5e')};
	border-bottom: ${props =>
		props.select ? '4px solid #f5b523' : '4px solid #fff'};
	cursor: pointer;

	span {
		color: ${props => (props.select ? '#f5b523 !important' : '#5e5e5e')};
	}

	a {
		text-decoration: none;
		color: ${props => (props.select ? '#f5b523 !important' : '#5e5e5e')};
	}
`;

export const ContentItemContent = styled.div`
	padding: 0 20px;
	font-size: 14px;
	height: 46px;
	line-height: 3.7;
	font-weight: 500;

	a {
		color: #5e5e5e;
	}

	span {
		display: inline-block;
	}

	@media (max-width: 768px) {
		padding: 0 20px;
	}

	@media (max-width: 414px) {
		padding: 0 17px;
	}
`;

export const OptionLine = styled.span`
	border-right: solid 1px #dfdfdf;
	height: 50px;
`;

export const Preview = styled.div`
	height: 46px;
	line-height: 3;

	span {
		color: #5e5e5e;
		padding: 0 20px;
		font-size: 14px;
		display: inline-block;
		height: 46px;
	}

	@media (max-width: 768px) {
		span {
			padding: 0 20px;
		}
	}

	@media (max-width: 414px) {
		span {
			padding: 0 17px;
		}
	}
`;

export const ToolBox = styled.div`
	display: flex;

	a:active {
		text-decoration: none;
	}
`;

export const ToolItem = styled.div`
	min-width: 86px;
	border-left: 1px solid #eee;
	text-align: center;
	height: 50px;
	line-height: 50px;
	font-size: 14px;
	font-weight: normal;
	cursor: pointer;
	white-space: nowrap;
	padding: 0 10px;

	a {
		color: #5e5e5e;
	}
	.save {
		width: 140px;
	}

	span {
		display: inline-block;
		min-width: 66px;
	}
`;

export const SearchBar = styled.div`
	height: 50px;
	line-height: 50px;
	display: inline-flex;
	border: 0px;
	color: #5e5e5e;
	border-bottom: 4px solid #f5b523;
	${props => {
		if (props.device === 'mobile') return 'width: 100%;';
	}}

	input[type=text] {
		width: ${props => (props.device === 'mobile' ? '100%' : '120px')};
		-webkit-transition: width 0.2s ease-in-out;
		transition: width 0.2s ease-in-out;
		border: 0;
		font-size: 16px;
		${props => {
			if (props.device === 'mobile') return 'padding-left: 15px;';
		}};
	}

	input[type='text']:focus {
		width: ${props => (props.device === 'mobile' ? '100%' : '320px')};
	}

	input::placeholder {
		/* Chrome, Firefox, Opera, Safari 10.1+ */
		color: #aaa;
		opacity: 1; /* Firefox */
	}

	input:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: #aaa;
	}

	input::-ms-input-placeholder {
		/* Microsoft Edge */
		color: #aaa;
	}

	button {
		line-height: 1;
		border: 0;
		background: #fff;
	}

	i {
		color: #ccc;
	}
`;

export const ImportContentItemContent = styled.div`
	padding: 0 25px;
	font-size: 14px;
	height: 46px;
	line-height: 3.7;

	a {
		color: #5e5e5e;
	}

	span {
		display: inline-block;
	}

	@media (max-width: 768px) {
		padding: 0 20px;
	}

	@media (max-width: 414px) {
		padding: 0 17px;
	}
`;
