import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

class ShareButton extends Component {
	constructor(props) {
		super(props);
		this.openFbShare = this.openFbShare.bind(this);
	}
	openFbShare(e) {
		e.preventDefault();
		window.open(this.href, 'targetWindow', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=500');
		return false;
	}
	render() {
		this.href = `https://www.facebook.com/sharer.php?u=https:${encodeURIComponent(this.props.url)}`;
		return (
			<div styleName="share_btn">
				<i className="icon share" />
				<span
					className="fb-share-button"
					data-href={ this.props.url }
					data-layout="button_count"
					data-size="small"
					data-mobile-iframe="true"
				>
					<a
						className="fb-xfbml-parse-ignore"
						target="_blank"
						rel="noopener noreferrer"
						onClick={ this.openFbShare }
						href={ this.href }
						data-gtm-activity="分享"
					>
						分享
					</a>
				</span>
			</div>
		);
	}
}

export default compose(
	// translate([]),
	[CSSModules, '_', css]
)(ShareButton);
