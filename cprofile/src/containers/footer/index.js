import React from 'react';
import styled from 'styled-components';
import { nowYear } from 'utils/time';

const FooterStyle = styled.footer`
	width: 100%;
	background-color: #f4f4f4;
	color: #7e7e7e;
	font-size: 14px;
	line-height: 35px;
	text-align: center;
	bottom: 0;
	padding: 8px 0 5px;
`;

const Footer = () => (
	<FooterStyle>一零四資訊科技股份有限公司　版權所有 © {nowYear()}</FooterStyle>
);

export default Footer;
