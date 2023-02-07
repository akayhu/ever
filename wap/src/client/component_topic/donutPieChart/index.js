import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

const d3 = require('d3');

class DonutPieChart extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		drawDonutChart(
			this.props.index,
			this.props.endorsePer,
			80,
			80,
			'9px'
		);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.endorsePer !== nextProps.endorsePer) {
			drawDonutChart(
				this.props.index,
				nextProps.endorsePer,
				80,
				80,
				'9px'
			);
		}
	}
	render() {
		return (
			<div
				styleName="endorsePer"
				className={ `pieChart${this.props.index}` }
			/>
		);
	}
}

function drawDonutChart(index, data, width, height, y) {
	d3.select(`.pieChart${index} > *`).remove();
	const dataset = {
		lower: calcData(0),
		upper: calcData(data)
	};
	const	radius = (Math.min(width, width) / 2) - 3;
	const	pie = d3.pie().sort(null);
	const	format = d3.format('');

	const arc = d3.arc()
	.innerRadius(radius - 10)
	.outerRadius(radius);

	const svg = d3.select(`.pieChart${index}`)
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr('transform', `translate(${width / 2},${height / 2})`);

	let path = svg.selectAll('path')
	.data(pie(dataset.lower))
	.enter().append('path')
	.attr('fill', (d, i) => i === 0 ? '#2E9FB9' : '#DCDCDC')
	.attr('d', arc)
	.each(function (d) { this._current = d; });

	const fullcircle = svg.append('svg:circle')
	.attr('stroke', '#DCDCDC')
	.attr('r', radius + 2)
	.attr('class', 'circle')
	.attr('fill', 'transparent')
	.attr('stroke-width', 1);

	const text = svg.append('text')
	.attr('text-anchor', 'middle')
	.attr('dy', y);

	const progress = 0;
	const timeout = setTimeout(() => {
		clearTimeout(timeout);
		path = path.data(pie(dataset.upper));
		path.transition().duration(1000).attrTween('d', function (a) {
			const i = d3.interpolate(this._current, a);
			const i2 = d3.interpolate(progress, data);
			this._current = i(0);
			return function (t) {
				text.text(Math.round(format(i2(t))));
				return arc(i(t));
			};
		});
	}, 200);
}

function calcData(data) {
	return [data, 100 - data];
}

export default compose(
	[CSSModules, '_', css]
)(DonutPieChart);
