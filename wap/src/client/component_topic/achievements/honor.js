import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
// components
import More from 'src/client/component_topic/more';
import LoadingBlock from 'src/client/component_common/loadingBlock';
import HonorTop from './honorTop';
import HonorList from './honorList';

const Honor = ({honorList, loading, isLogin}) => {
	if (loading) {
		return <LoadingBlock show height={ 300 } />;
	}
	if (!honorList.length) {
		return null;
	}
	const firstFive = honorList.slice(0, 5);
	const length = firstFive.length;
	const [first, ...rest] = firstFive;

	return (
		<div>
			{(length === 1 || length === 5) &&
				<HonorTop data={ first } />
			}
			{length !== 1 &&
				<HonorList listData={ length < 5 ? firstFive : rest } />
			}
			{(isLogin && honorList.length > 5) &&
				<More text="看更多成就" linkUrl="/topic/honor/staffList" />
			}
		</div>
	);
};

export default CSSModules(Honor, css, {allowMultiple: true});

