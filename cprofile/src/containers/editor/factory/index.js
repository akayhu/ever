import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Category from './category';
import TemplatesBox from './templatesBox';
import { changeShowTag } from 'actions/ui/factory';
import { isMobile } from 'react-device-detect';
import './style.css';

const Factory = props => {
	const { showlightbox, commonMode } = props;
	const dispatch = useDispatch();
	const factory = useSelector(state => state.getIn(['ui', 'factory']));
	const plusActivity = useSelector(state =>
		state.getIn(['ui', 'plusActivity', 'hasPlusActivity'])
	);
	const showTag = factory.get('showTag');
	const onChangeShow = blockType => dispatch(changeShowTag(blockType));

	const renderCategory = (list, discriminate) => {
		return (
			<Fragment>
				{list.map((key, index) => {
					return (
						<Category
							key={key}
							blockType={key}
							commonMode={props.commonMode}
							discriminate={discriminate}
							onChangeShow={onChangeShow}
						/>
					);
				})}
			</Fragment>
		);
	};

	const _renderMain = () => {
		const aboutList = ['basic', 'experience', 'education', 'talent'];
		const achList = plusActivity
			? ['honor', 'github', 'behance', 'gallery', 'plus_activity']
			: ['honor', 'github', 'behance', 'gallery'];
		const othersList = ['custom'];
		return (
			<div>
				<div className="category-title top">About Me</div>
				{renderCategory(aboutList)}
				<div className="category-title top">Accomplishment</div>
				{renderCategory(achList, 'commonMode')}
				<div className="category-title top">Others</div>
				{renderCategory(othersList, 'commonMode')}
			</div>
		);
	};

	return (
		<div
			className={
				isMobile
					? 'factory-container mobile-factory-container'
					: 'factory-container'
			}
			style={commonMode ? { top: '0' } : null}
		>
			{showTag.length > 0 && (
				<TemplatesBox showlightbox={showlightbox} blockType={showTag} />
			)}
			{showTag === '' && _renderMain()}
		</div>
	);
};

export default Factory;
