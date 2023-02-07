import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { BrowserView, MobileView } from 'react-device-detect';
import {
	addCard,
	injectPlaceholder,
	removePlaceholder,
	PLACEHOLDER_KEY,
} from 'actions/ui/card';

const TargetOption = {
	drop(props, monitor, component) {
		const dragTarget = monitor.getItem();
		props.addCard(
			dragTarget.blockType,
			dragTarget.uniKey,
			1,
			dragTarget.templateType,
			dragTarget.needCreate
		);
		props.removePlaceholder();
	},
	// 為簡化判斷，這邊不直接在 hover 時插入 placeholder，而是單純更改 promote 樣式
};

const TargetCollect = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isHovering: monitor.isOver(),
});

const Promote = ({
	connectDropTarget,
	text,
	isHovering,
	isDragging,
	showTag,
}) =>
	connectDropTarget(
		<div className="block-wrapper promote" data-block-is-hovering={isHovering}>
			<BrowserView>
				{showTag.length > 0 && showTag !== 'basic'
					? '點擊或拖曳左側圖片即可新增'
					: '點擊左側選單開始編輯'}
			</BrowserView>
			<MobileView>
				{showTag.length > 0 ? '點擊左側圖片即可新增' : '點擊左側選單開始編輯'}
			</MobileView>
		</div>
	);

const mapStateToProps = state => ({
	showTag: state.getIn(['ui', 'factory', 'showTag']),
	isDragging: state.getIn(['ui', 'blocksList', 'isDragging']),
	placeholderIndex: state
		.get('blocksList')
		.findIndex(key => key === PLACEHOLDER_KEY),
});

export default compose(
	connect(
		mapStateToProps,
		{
			addCard,
			injectPlaceholder,
			removePlaceholder,
		}
	),
	DropTarget('TEMPLATE', TargetOption, TargetCollect)
)(Promote);
