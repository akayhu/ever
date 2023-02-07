import React from 'react';
import Header from 'containers/header';
import Error404 from 'components/defaultSmallImage/error404.png';
import Error500 from 'components/defaultSmallImage/error500.png';
import {
	Container,
	Field,
	Title,
	SubTitle,
	Description,
	StyledLink,
	Cover,
} from './styledComponents';

const ErrorPage = ({ match, history }) => (
	<div>
		<Header mobileLogo={true} optionRightList={['search', 'login']} />
		<Container>
			<Field>
				<Cover bgImage={match.params.code === '500' ? Error500 : Error404}>
					<Title paramsCode={match.params.code === '500' ? '500' : '404'}>
						{match.params.code === '500'
							? '服務目前有些異常'
							: '你想拜訪的頁面不存在'}
					</Title>
				</Cover>
				<SubTitle>
					{match.params.code === '500'
						? '我們正在努力修復錯誤中，請稍後再訪問此頁'
						: '你所點擊進來的連結可能已失效，或是頁面已被移除'}
				</SubTitle>
				<Description>
					<StyledLink to="" onClick={() => history.goBack()}>
						返回上一頁
					</StyledLink>
					・<StyledLink to="/editor">編輯個人檔案</StyledLink>・
					<StyledLink to="/search">瞧瞧別人怎麼寫</StyledLink>
				</Description>
			</Field>
		</Container>
	</div>
);

export default ErrorPage;
