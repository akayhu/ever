import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { noviceGuideEnd } from 'actions/ui/noviceGuide';
import tutorial_add from 'components/defaultSmallImage/tutorial_add.gif';
import tutorial_theme from 'components/defaultSmallImage/tutorial_theme.gif';
import tutorial_drag from 'components/defaultSmallImage/tutorial_drag.gif';
import { Icon } from 'antd';
import {
	NoviceGuideMain,
	NoviceGuideSlider,
	SetSliderStyles,
} from './styledComponents';
import './style.scss';

const NoviceGuide = () => {
	const [active, setActive] = useState(0);
	const [max] = useState(3);
	const [slides] = useState([
		{
			title: '輕鬆簡單新增一個區塊',
			content:
				'透過簡易的拖放與點擊式操作，即可立刻將別具風格的資料區塊新增至你的個人檔案。',
			image: tutorial_add,
		},
		{
			title: '隨你喜好更換樣板樣式',
			content:
				'104個人檔案 提供了各種不同的樣板樣式，透過左鍵點擊選取，依照個人的需求與喜好轉換不同風格。',
			image: tutorial_theme,
		},
		{
			title: '自訂區塊排序',
			content:
				'比起學歷經歷，更想先向別人展示你過往的作品嗎？以左鍵長按『拖動區塊』按鈕，讓你能夠按照理想的順序描述你個人的故事。',
			image: tutorial_drag,
		},
	]);
	const dispatch = useDispatch();

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		document.body.style.paddingRight = '6px';
	}, []);

	const renderSlides = () =>
		slides.map((item, index) => (
			<div className="each-slide noviceGuide-outerLayer--div" key={index}>
				<img src={item.image} width="100%" alt={item.title} />
				<div className="noviceGuide-outerLayer--content">
					<div className="noviceGuide-outerLayer--title">{item.title}</div>
					<p>{item.content}</p>
				</div>
			</div>
		));

	const _handleNoviceGuideEnd = () => {
		document.body.removeAttribute('style');
		dispatch(noviceGuideEnd());
	};

	const nextOne = () => {
		if (active < max - 1) setActive(active + 1);
	};

	const prevOne = () => {
		if (active > 0) setActive(active - 1);
	};

	const renderArrows = () => (
		<div className="arrow-button">
			{active > 0 && (
				<button className="prev" onClick={prevOne}>
					←
				</button>
			)}
			{active <= 1 && (
				<button className="next" onClick={nextOne}>
					→
				</button>
			)}
			{active >= 2 && (
				<button className="next-ok" onClick={_handleNoviceGuideEnd}>
					<Icon type="check" />
				</button>
			)}
		</div>
	);

	const isActive = value => {
		if (active === value) return 'active';
	};

	const dots = index => {
		setActive(index);
	};

	const renderDots = () =>
		slides.map((item, index) => (
			<li
				className={isActive(index) + ' dots'}
				key={index}
				onClick={() => dots(index)}
			>
				<span>&#9679;</span>
			</li>
		));

	const renderNoviceGuideContent = () => (
		<div className="noviceGuide-outerLayer">
			<NoviceGuideMain className="noviceGuide-outerLayer--main">
				<NoviceGuideSlider className="noviceGuide-outerLayer-slider">
					<SetSliderStyles
						className="wrapper"
						active={active}
						slidesLength={slides.length}
					>
						{renderSlides()}
					</SetSliderStyles>
				</NoviceGuideSlider>
				{renderArrows()}
				<ul className="dots-container">{renderDots()}</ul>
			</NoviceGuideMain>
		</div>
	);

	return renderNoviceGuideContent();
};

export default NoviceGuide;
