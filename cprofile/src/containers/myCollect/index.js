import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	registerStateMachine,
	stateMachineTransition,
	removeStateMachine,
} from 'actions/ui/statemachine';
import stateMachine from './statemachine';
import { WebAppBody, Loading, SubmitButton } from 'share/styledComponents';
import publishImg from 'components/defaultSmallImage/publish.png';
import LightboxWrongCopy from 'components/lightboxWrongCopy';
import Header from 'containers/header';
import SearchNewBlock from 'components/searchNewBlock';
import { Block, MyCollectMain, Title, Layer } from './styledComponents';
import './style.css';

const MyCollect = props => {
	const { history } = props;
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(registerStateMachine('collection', stateMachine));
		return () => {
			dispatch(removeStateMachine('collection'));
		};
	}, []);

	const stage = useSelector(state =>
		state.getIn(['ui', 'statemachine', 'collection', 'value'])
	);
	const collection = useSelector(state => state.get('collection'));

	const handler = () => {
		const stageValue = stage || 'loading';
		const stageType = {
			empty: history.push('/search'),
			error: dispatch(stateMachineTransition('collection', 'REFRESH')),
		};
		return stageType[stageValue] || null;
	};

	const renderLoading = () => (
		<WebAppBody background="#f6f6f6">
			<Header mobileLogo={true} optionRightList={['search', 'login']} />
			<MyCollectMain center="both">
				<Block>
					<Loading />
				</Block>
			</MyCollectMain>
		</WebAppBody>
	);

	const renderList = () => (
		<WebAppBody background="#f6f6f6" height="auto">
			<Header mobileLogo={true} optionRightList={['search', 'login']} />
			<MyCollectMain>
				<Title>我的收藏</Title>
				<Layer>
					{collection.toJS().map((profile, index) => (
						<SearchNewBlock key={`${index}-${profile.pid}`} data={profile} />
					))}
				</Layer>
			</MyCollectMain>
		</WebAppBody>
	);

	const renderEmpty = () => (
		<WebAppBody background="#f6f6f6">
			<Header mobileLogo={true} optionRightList={['search', 'login']} />
			<MyCollectMain center="both">
				<Block>
					<img src={publishImg} alt="收藏" width="260" />
					<h3>目前沒有任何收藏喔!</h3>
					<SubmitButton onClick={handler}>再去瞧瞧別人</SubmitButton>
				</Block>
			</MyCollectMain>
		</WebAppBody>
	);

	const renderDefault = () => (
		<WebAppBody background="#f6f6f6">
			<Header mobileLogo={true} optionRightList={['search', 'login']} />
			<MyCollectMain center="both">
				<Block>
					<LightboxWrongCopy />
					<SubmitButton onClick={handler}>再試一次</SubmitButton>
				</Block>
			</MyCollectMain>
		</WebAppBody>
	);

	const stageType = {
		loading: renderLoading(),
		list: renderList(),
		empty: renderEmpty(),
	};

	return stageType[stage] || renderDefault();
};

export default MyCollect;
