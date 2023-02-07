import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';

class SearchBar extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
		this.state.searchKeyword = props.searchKeyword || '';
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.searchKeyword !== this.props.searchKeyword) {
			this.setState({
				searchKeyword: nextProps.searchKeyword || ''
			});
		}
	}
	search() {
		const { handleSearch, allowEmpty } = this.props;
		const { searchKeyword } = this.state;
		if (typeof handleSearch !== 'undefined' && (allowEmpty || searchKeyword !== '')) {
			this.props.handleSearch(this.state.searchKeyword);
		}
	}
	handleChange(e) {
		this.setState({searchKeyword: e.target.value});
	}
	handleKeydown(e) {
		if (e.keyCode === 13) {
			this.search();
			return;
		}
	}
	render() {
		return (
			<div styleName="search_article">
				<div styleName="search_input">
					<ul>
						<li>
							<input
								onChange={ e => this.handleChange(e) }
								onKeyDown={ e => this.handleKeydown(e) }
								placeholder={ this.props.placeholder }
								value={ this.state.searchKeyword }
							/>
						</li>
						<li onClick={ () => this.search() }>
							<i className="search icon" />
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default compose(
	// connect(mapStateToProps),
	// translate([]),
	[CSSModules, '_', css]
)(SearchBar);
