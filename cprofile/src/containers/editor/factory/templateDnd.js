import React from 'react';
import { DragSource } from 'react-dnd';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { toggleBlocksListDrag } from 'actions/ui/blocksList';
import { removePlaceholder } from 'actions/ui/card';
import { updateSortProcess } from 'actions/sort';

const TemplateSourceOption = {
	beginDrag(props, monitor, component) {
		const targetConfig = props.config.find(
			data => data.get('blockType') === props.blockType
		);

		if (typeof props.toggleBlocksListDrag === 'function') {
			props.toggleBlocksListDrag(true);
		}

		return {
			...props,
			needCreate: !targetConfig,
		};
	},
	endDrag(props, monitor) {
		if (typeof props.toggleBlocksListDrag === 'function') {
			props.toggleBlocksListDrag(false);
			props.removePlaceholder();
		}
		if (monitor.didDrop()) {
			props.updateSortProcess('BLOCK');
		}
	},
	canDrag(props) {
		const targetConfig = props.config.find(
			data => data.get('blockType') === props.blockType
		);
		return targetConfig ? !targetConfig.get('visibility') : true;
	},
};

const TemplateSourceCollect = (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	sourceIsDragging: monitor.isDragging(),
});

const Template = props =>
	props.connectDragSource(
		<div className="template-card">{props.children}</div>
	);

const mapStateToPorps = state => ({
	config: state.get('config'),
});

export default compose(
	connect(
		mapStateToPorps,
		{
			toggleBlocksListDrag,
			removePlaceholder,
			updateSortProcess,
		}
	),
	DragSource('TEMPLATE', TemplateSourceOption, TemplateSourceCollect)
)(Template);
