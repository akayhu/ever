import React, { PureComponent, Fragment } from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
// import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import nameMap from 'config/nameMap';
import { moveBlockElem } from 'actions/ui/card';
import { updateSortProcess } from 'actions/sort';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import './style.scss';

const MobileDndElementBlockMain = styled.div`
	@media only screen and (max-width: 414px) {
		&[data-switch-transition-role='fromTop'] {
			transition: transform 0.5s;
			transform: ${props =>
				`translate(0px, calc(0% + ${props.dndElementFromBottomHeight}px))`};
		}
		&[data-switch-transition-role='fromBottom'] {
			transition: transform 0.5s;
			transform: ${props =>
				`translate(0px, calc(0% - ${props.dndElementFromTopHeight}px))`};
		}
	}
`;

const cardTarget = {
	drop(props, monitor, component) {
		const dragTarget = monitor.getItem();
		const hoverTarget = props;
		if (dragTarget.templateType) return;

		let dragIndex = dragTarget.index;
		// FIXME: 確認 hover inject_placeholder 的 index 是否運作正確
		let hoverIndex = hoverTarget.index;
		const uidName = nameMap[dragTarget.blockType].uidName;
		props.moveBlockElem(
			dragTarget.blockType,
			dragTarget.uniKey,
			dragTarget[uidName],
			dragIndex,
			hoverIndex
		);
	},
	hover(props, monitor, component) {
		// FIXME: 確認 hover inject_placeholder 的 index 是否運作正確
		const dragTarget = monitor.getItem();
		const hoverTarget = props;

		if (dragTarget.templateType) return;

		let dragIndex = dragTarget.index;
		let hoverIndex = hoverTarget.index;

		if (dragIndex === hoverIndex) {
			return;
		}

		// const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		// const hoverMiddleY = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

		// Determine mouse position
		// const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		// const hoverClientY = clientOffset.x - hoverBoundingRect.left;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%
		// let direction = hoverIndex > dragIndex ? 'right' : 'left';
		// Dragging downwards

		if (dragIndex < hoverIndex || dragIndex > hoverIndex) {
			const uidName = nameMap[dragTarget.blockType].uidName;
			props.moveBlockElem(
				dragTarget.blockType,
				dragTarget.uniKey,
				dragTarget[uidName],
				dragIndex,
				hoverIndex
			);
		}

		// Dragging downwards
		// if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
		// 	return;
		// }

		// Dragging upwards
		// if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
		// 	return;
		// }

		// Time to actually perform the action
		// props.moveCard(dragIndex, hoverIndex);
		// props.onHoverCard(hoverIndex, direction, dragTarget.uniKey);
		// console.log({ hoverIndex, direction, uniKey: dragTarget.uniKey});
		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		dragTarget.index = hoverIndex;
	},
};

const cardSource = {
	beginDrag(props, monitor, component) {
		return {
			ref: component._ref,
			moveSortItem: component.component,
			...props,
		};
	},
	endDrag(props, monitor) {
		if (monitor.didDrop()) {
			const { blockType, uniKey } = monitor.getItem();
			const sortType = fromJS(nameMap).getIn([blockType, 'sortType']);
			props.updateSortProcess(sortType, { blockType, uniKey });
		}
	},
	canDrag: function(props, monitor) {
		return props.canDrag;
	},
};

const TargetCollect = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
});

const SourceCollect = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
	connectDragPreview: connect.dragPreview(),
});

class DndElement extends PureComponent {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		connectDragPreview: PropTypes.func.isRequired,
	};

	render() {
		const {
			connectDragSource,
			connectDropTarget,
			isDragging,
			sourceIsDragging,
			connectDragPreview,
			dndElementClass,
			fromTop,
			fromBottom,
			index,
			dndElementFromTopHeight,
			dndElementFromBottomHeight,
		} = this.props;
		const noneStyle =
			sourceIsDragging || isDragging
				? { opacity: '0.3' }
				: { display: 'contents' };

		// mobile交換區塊的轉場動畫
		let switchTransitionRole = 'none';
		if (fromTop === index) switchTransitionRole = 'fromTop';
		if (fromBottom === index) switchTransitionRole = 'fromBottom';

		return (
			<Fragment>
				{!isMobile &&
					connectDropTarget(
						<div
							className={
								isDragging ? `drag-wrapper ${dndElementClass}` : 'drag-wrapper'
							}
							style={noneStyle}
							ref={_ref => (this._ref = _ref)}
						>
							{React.cloneElement(this.props.children, {
								elmDragSource: connectDragSource,
								elmDragPreview: connectDragPreview,
							})}
						</div>
					)}
				{isMobile && (
					<MobileDndElementBlockMain
						className="drag-wrapper"
						data-switch-transition-role={switchTransitionRole}
						dndElementFromTopHeight={dndElementFromTopHeight}
						dndElementFromBottomHeight={dndElementFromBottomHeight}
					>
						{this.props.children}
					</MobileDndElementBlockMain>
				)}
			</Fragment>
		);
	}
}

export default compose(
	connect(
		null,
		{ moveBlockElem, updateSortProcess }
	),
	DropTarget('card', cardTarget, TargetCollect),
	DragSource('card', cardSource, SourceCollect)
)(DndElement);
