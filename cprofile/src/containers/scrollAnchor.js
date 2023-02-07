import React, { Component, Fragment } from 'react';
import Scrollchor from 'react-scrollchor';

const withScrollAnchor = WrappedComponent => {
	class ScrollAnchor extends Component {
		state = {
			targetId: '',
		};

		scrollToAnchor = targetId => {
			this.setState({ targetId }, () => {
				const element = document.getElementById(targetId);
				if (element) {
					this.refs.scrollToAnchor.simulateClick();
					element.id === 'tmpIdForScroll'
						? element.removeAttribute('id')
						: void 0;
				}
				this.setState({ scrollKey: '' });
			});
		};

		render() {
			return (
				<Fragment>
					<Scrollchor
						ref="scrollToAnchor"
						animate={{ offset: -125 }}
						to={this.state.targetId}
						disableHistory={true}
					/>
					<WrappedComponent
						scrollToAnchor={this.scrollToAnchor}
						{...this.props}
					/>
				</Fragment>
			);
		}
	}

	return ScrollAnchor;
};

export default withScrollAnchor;
