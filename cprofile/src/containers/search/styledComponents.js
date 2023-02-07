import styled from 'styled-components';
import Bg from 'components/defaultImage/search_background.jpg';

export const SearchTop = styled.div`
	background-image: url(${Bg});
	height: 500px;
	background-size: 100%;
	background-repeat: no-repeat;
	background-position: 0% 10%;

	@media only screen and (max-width: 768px) {
		background-position: 0% 0%;
		height: 485px;
	}

	@media only screen and (max-width: 667px) {
		height: 440px;
	}

	@media only screen and (max-width: 640px) {
		height: 425px;
	}

	@media only screen and (max-width: 600px) {
		height: 350px;
	}

	@media only screen and (max-width: 480px) {
		height: 310px;
	}

	@media only screen and (max-width: 384px) {
		height: 250px;
	}
`;

export const SearchMain = styled.div`
	max-width: 1285px;
	padding: 70px 0 0;
	margin: 0 auto;

	@media only screen and (max-width: 1024px) {
		.searcTitle {
			padding-left: 10px;
		}
	}
`;

export const Category = styled.div`
	text-align: center;
`;

export const ListSearchMain = styled.div`
	max-width: 1285px;
	padding: 70px 0 0;
	margin: 0 auto;

	@media only screen and (max-width: 480px) {
		.searcTitle {
			font-size: 16px;
		}
	}
	@media only screen and (max-width: 414px) {
		padding: 20px 0 0;

		.searcTitle {
			padding-left: 10px;
		}
	}
`;

export const SearchNoDataMain = styled.div`
	padding-top: 350px;
	text-align: center;
	width: 100%;
	height: 100%;

	@media only screen and (max-width: 320px) {
		padding-top: 250px;
	}
`;
