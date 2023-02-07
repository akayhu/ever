import React, { PureComponent } from 'react';
import './style.css';
import nameMap from '../../../../config/nameMap';
import CategoryTitle from 'components/categoryTitle';
import { isMobile } from 'react-device-detect';

class Category extends PureComponent {
	constructor(props) {
		super(props);
		this.titleClick = e => this._titleClick(e);
		this.collapseIt = e => this._collapseIt(e);
	}

	_titleClick(e) {
		this.props.onChangeShow(this.props.blockType);
	}

	_collapseIt(e) {
		this.props.onChangeShow('');
	}

	render() {
		const { blockType, showlightbox, commonMode, discriminate } = this.props;
		return (
			<div
				className={
					isMobile
						? 'category-container mobile-category-container'
						: 'category-container'
				}
			>
				<CategoryTitle
					title={nameMap[blockType].name}
					blockType={blockType}
					showlightbox={showlightbox}
					commonMode={commonMode}
					discriminate={discriminate}
				/>
			</div>
		);
	}
}

export default Category;
