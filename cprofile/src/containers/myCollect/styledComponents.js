import styled from 'styled-components';

export const Block = styled.div`
	width: ${props => props.width || 'auto'};
	height: ${props => props.height || 'auto'};
	margin: 0 auto;
	text-align: center;
	display: inline-block;
	vertical-align: middle;

	h3 {
		margin: 1em 0 2em 0;
	}
`;

export const MyCollectMain = styled.div`
	max-width: 1285px;
	height: 100%;
	margin: 50px auto 0 auto;
	padding: 70px 10px;
	${props =>
		props.center === 'both' || props.center === 'vertical'
			? `
      &::before {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
    `
			: ''}
	${props =>
		props.center === 'both' || props.center === 'horizental'
			? `
      text-align: center;
    `
			: ''}

  @media only screen and ( max-width: 414px ) {
		padding: 20px 0 0;
	}
`;

export const Title = styled.h3`
	font-family: PingFangTC;
	font-size: 20px;
	font-weight: normal;
	font-style: normal;
	font-stretch: normal;
	line-height: normal;
	letter-spacing: normal;
	color: #2b2b2b;
	margin-bottom: 15px;

	@media only screen and (max-width: 414px) {
		padding-left: 10px;
	}

	@media only screen and (max-width: 480px) {
		font-size: 16px;
	}
`;

export const Layer = styled.div`
	flex-wrap: wrap;
	display: flex;
	align-content: flex-start;
	padding-bottom: 40px;
	width: 100%;
	background-color: #f6f6f6;
	min-height: 270px;

	@media only screen and (max-width: 480px) {
		padding-bottom: 20px;
	}
`;
