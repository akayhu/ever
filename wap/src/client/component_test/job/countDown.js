import React, { Component } from 'react';

class CountDown extends Component {
	constructor(props) {
		super(props);
		this.state = {
			duration: '00:00'
		};
		this.timer = this.getTime(props.duration);
		this.getTime = this.getTime.bind(this);
	}
	getTime(duration) {
		let timer = duration;
		let minutes = 0;
		let seconds = 0;

		return setInterval(() => {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? `0${minutes}` : minutes;
			seconds = seconds < 10 ? `0${seconds}` : seconds;

			this.setState({
				duration: `${minutes}:${seconds}`
			});
			const tempTimer = timer -= 1;
			timer = tempTimer > 0 ? tempTimer : 0;
		}, 1000);
	}
	render() {
		const { duration } = this.state;
		return (
			<span>
				{ duration }
			</span>
		);
	}
}

export default CountDown;
