import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import Image from 'src/client/component_common/image';

class DraggableImg extends Component {
	constructor(props) {
		super(props);
		this.pos = {
			x: 0, y: 0
		};
		this.handleDrag = this.handleDrag.bind(this);
		this.handleStop = this.handleStop.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.editing === true && nextProps.editing === false) {
			this.pos = {x: 0, y: 0 };
		}
	}
	handleDrag(e, ui) {
		e.preventDefault();
		const { x, y } = this.pos;
		this.pos = {
			x: x + ui.deltaX,
			y: y + ui.deltaY
		};
	}
	handleStop(e) {
		e.preventDefault();
		this.props.trackPos(this.pos);
	}
	render() {
		const { range, editing, originImg, imgForDrag, type, defaultPositionX, defaultPositionY, title } = this.props;
		const imgSrc = editing ? imgForDrag : originImg;
		const DraggableY = defaultPositionY * -1;

		if (!editing) {
			return (
				<Image
					ref={ _ref => this.showImg = _ref }
					type="cover"
					retry={ true }
					domain={ type }
					src={ imgSrc }
					alt={ title }
				/>
			);
		}

		return (
			<Draggable
				bounds={ range }
				defaultPosition={ { x: defaultPositionX, y: DraggableY } }
				onDrag={ this.handleDrag }
				onStop={ this.handleStop }
				disabled={ !editing }
			>
				<div style={ { cursor: 'move' } }>
					<img ref={ _ref => this.targetImg = _ref } src={ imgSrc } alt={ title } />
				</div>
			</Draggable>
		)
	}
}
DraggableImg.propTypes = {
	range: PropTypes.object,
	imgForDrag: PropTypes.string,
	originImg: PropTypes.string,
	editing: PropTypes.bool,
};
DraggableImg.defaultProps = {
	defaultPositionX: 0,
	defaultPositionY: 0
};
export default DraggableImg;
