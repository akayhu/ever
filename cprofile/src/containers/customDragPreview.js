import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DragLayer } from 'react-dnd';
import { BlockTitle, BLOCK_DRAG_TYPE } from 'containers/toolbar/block';

/**
 * Style
 */
const Layer = styled.div`
	position: fixed;
	pointer-events: none;
	z-index: 100;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
`;

const Container = styled.div`
	max-width: 944px;
	border: 3px solid #f7f7f7;
	border-radius: 5px;
	background: #fff;
`;

/**
 * Drag Layer setting
 */
const Collect = monitor => ({
	item: monitor.getItem(),
	itemType: monitor.getItemType(),
	initialOffset: monitor.getInitialSourceClientOffset(),
	currentOffset: monitor.getSourceClientOffset(),
	isDragging: monitor.isDragging(),
});

/**
 * 元件
 */
class CustomDragPreviewLayer extends Component {
	static propTypes = {
		itemType: PropTypes.string,
		isDragging: PropTypes.bool.isRequired,
	};

	getItemStyles = () => {
		const { initialOffset, currentOffset } = this.props;
		if (!initialOffset || !currentOffset) {
			return {
				display: 'none',
			};
		}

		let { x, y } = currentOffset;
		const transform = `translate(${x - 920}px, ${y}px)`;
		return {
			transform,
			WebkitTransform: transform,
		};
	};

	renderPreviewByDragType = () => {
		let preview = null;
		// NOTE: 根據不同拖曳 type 呈現自訂的 drag preview
		switch (this.props.itemType) {
			case BLOCK_DRAG_TYPE: {
				preview = (
					<Container>
						<BlockTitle blockType={this.props.item.config.blockType} />
					</Container>
				);
				break;
			}
			default: {
				return null;
			}
		}
		return (
			<Layer>
				<div style={this.getItemStyles()}>{preview}</div>
			</Layer>
		);
	};
	render() {
		return this.props.isDragging ? this.renderPreviewByDragType() : null;
	}
}

export default DragLayer(Collect)(CustomDragPreviewLayer);
