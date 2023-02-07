import styled from 'styled-components';

// -webkit-box-orient: vertical 在 class 裡不會出現，改用 styled-components 解決
export const BehanceBlockTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	line-height: 1.35;
	color: #484848;
	padding: 10px;
	font-family: PingFangTC;
	overflow: hidden;
	display: -webkit-box;
	line-height: 1.5;
	-webkit-line-clamp: 2;
	max-height: 55px;
	-webkit-box-orient: vertical;
`;

export const BehanceBlockDescription = styled.div`
	font-size: 12px;
	margin: 0 10px 10px;
	font-weight: 500;
	overflow: hidden;
	display: -webkit-box;
	line-height: 1.5;
	-webkit-line-clamp: 2;
	max-height: 34px;
	-webkit-box-orient: vertical;
`;
