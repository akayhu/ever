import React, { Component } from 'react';

let d3 = null;
let d3tip = null;

class Chart extends Component {
	constructor(props, context) {
		super(props, context);

		this.draw = this.draw.bind(this);
	}
	componentDidMount() {
        d3 = require('d3');
        d3tip = require('d3-tip')(d3);
		this.draw();
	}
	draw(rawData) {
		const data = this.props.data;

		const margin = {top: 40, right: 80, bottom: 40, left: 80};

		let width = 250,
			height = 250,
			radius = Math.min(width, height) / 2,
			radius2 = Math.min(width - 50, height - 50) / 2,
			innerRadius = 0.15 * radius;

		const pie = d3.pie()
    .sort(null)
    .value(d => d.width);


		const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(d => (radius - innerRadius) * (d.data.score / 100.0) + innerRadius);

		const outlineArc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius);

		const outlineArc2 = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius - 28);

		const outlineArc3 = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius - 53);

		const outlineArc4 = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius - 78);

		const svg = d3.select('#pi_chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('overflow', 'inherit')
    .append('g')
    .attr('transform', `translate(${width / 2 + margin.left},${height / 2 + margin.top})`);

    // var tip = d3tip.attr('class', 'd3-tip')
    // .offset([0, 0])
    // .html(function(d) {
    //   return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
    // });
    // svg.call(tip);


		data.forEach((d) => {
			d.id = d.id;
			d.order = +d.order;
			d.color = d.color;
			d.weight = +d.weight;
			d.score = +d.score;
			d.width = +d.weight;
			d.label = d.label;
		});

		const outerPath = svg.selectAll('.outlineArc')
    .data(pie(data))
    .enter().append('path')
    .attr('fill', 'none')
    .attr('stroke', '#eee')
    .attr('class', 'outlineArc')
    .attr('d', outlineArc);

		const outerPath2 = svg.selectAll('.outlineArc2')
    .data(pie(data))
    .enter().append('path')
    .attr('fill', 'none')
    .attr('stroke', '#eee')
    .attr('class', 'outlineArc2')
    .attr('d', outlineArc2);

		const outerPath3 = svg.selectAll('.outlineArc3')
    .data(pie(data))
    .enter().append('path')
    .attr('fill', 'none')
    .attr('stroke', '#eee')
    .attr('class', 'outlineArc3')
    .attr('d', outlineArc3);

		const outerPath4 = svg.selectAll('.outlineArc4')
    .data(pie(data))
    .enter().append('path')
    .attr('fill', 'none')
    .attr('stroke', '#eee')
    .attr('class', 'outlineArc4')
    .attr('d', outlineArc4);

		const outerGroup = svg.selectAll('.testReportPie')
    .data(pie(data))
    .enter()
    .append('g');

		outerGroup
    .append('path')
    .attr('fill', d => d.data.color)
    .attr('class', 'testReportPie')
    .attr('stroke', '#eee')
    .attr('d', arc);
    // .on('mouseover', d3tip.show)
    // .on('mouseout', d3tip.hide);

		outerGroup
    .append('text')
    .attr('transform', d => `translate(${centroid(40, width, d.startAngle, d.endAngle)})`)
    .attr('text-anchor', 'middle')
    .attr('class', 'pieText')
    .style('font-size', '14px')
    .text(d => d.data.label);

		outerGroup
    .append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-size', (d) => {
	if (d.data.score <= 20) {
		return '18px';
	}
	return '14px';
})
    .text(d => d.data.score);

    // outerGroup
    // .insert("circle","text")
    // .attr("transform", function(d) {
    //   return "translate(" + centroid(-10, width, d.startAngle, d.endAngle) + ")";
    // })
    // .attr("cx", "10px")
    // .attr("cy", "10px")
    // .attr("r", "10px")
    // .attr("fill", function(d) { return d.data.color; })
    //
    // outerGroup
    // .append('line').attr({
    //   x1: function(d, i) {
    //     return arc.centroid(d)[0];
    //   },
    //   y1: function(d) {
    //     return arc.centroid(d)[1];
    //   },
    //   x2: function(d) {
    //     var centroid = arc.centroid(d),
    //         midAngle = Math.atan2(centroid[1], centroid[0]);
    //     return Math.cos(midAngle) * 130;
    //   },
    //   y2: function(d) {
    //     var centroid = arc.centroid(d),
    //         midAngle = Math.atan2(centroid[1], centroid[0]);
    //     return Math.sin(midAngle) * 130;
    //   },
    //   'stroke': function(d, i) {
    //     return d.data.color
    //   }
    // });

    // calculate the weighted mean score
		const score =
    data.reduce((a, b) => a + (b.score * b.weight), 0) /
    data.reduce((a, b) => a + b.weight, 0);

		svg.append('svg:text')
    .style('font-size', '14px')
    .attr('dy', '.25em')
    .attr('text-anchor', 'middle') // text-align: right
    .text(this.props.text);

		function centroid(innerR, outerR, startAngle, endAngle) {
			let r = 30 + (innerR + outerR) / 2,
				a = (startAngle + endAngle) / 2 - (Math.PI / 2);
			return [Math.cos(a) * r, Math.sin(a) * r];
		}
	}
	render() {
		return (
			<div id="pi_chart" />
		);
	}
}

export default Chart;
