import React from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// components
import More from 'src/client/component_topic/more';
import LoadingBlock from 'src/client/component_common/loadingBlock';
import Carousel from '../carousel';
import WorksList from './worksList';

const Work = ({galleryList, loading, isLogin}) => {
	if (loading) {
		return <LoadingBlock show height={ 300 } />;
	}
	if (!galleryList.length) {
		return null;
	}

	galleryList.forEach((object, index)=> {
		if(object.hasOwnProperty('extraInfo') && object.extraInfo.attachmentList && object.extraInfo.attachmentList.length > 0 ) {
			galleryList[index].worksImg = object.extraInfo.attachmentList[0].activityFileUrl;
		}
	})

	const firstFive = galleryList.slice(0, 5);
	const length = firstFive.length;
	const [first, ...rest] = firstFive;

	return (
		<div>
			{(length === 1 || length === 5) &&
				<Carousel
					width={ 800 }
					data={ galleryList }
				/>
			}
			{length !== 1 &&
				<WorksList
					data={ length < 5 ? firstFive : rest }
					carouselIndex={ 0 }
				/>
			}
			{(isLogin && galleryList.length > 5) &&
				<More text="看更多作品" linkUrl="/topic/gallery/staffList" />
			}
		</div>
	);
};

export default CSSModules(Work, css, {allowMultiple: true});
