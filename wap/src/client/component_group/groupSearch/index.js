import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
// actions
import { triggerSearch } from 'src/client/actions/group';
// selectors
import { getGroupMemberSearchKey } from 'src/client/reducers/group/selectors';

class GroupSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			keyword: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.search = this.search.bind(this);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (!nextProps.searching) {
			this.setState({
				keyword: ''
			});
		}
	}
	search() {
		if (!this.searchInput.value) return;

		const { triggerSearch, channelId } = this.props;
		const { keyword } = this.state;
		triggerSearch({ keyword, channelId, category: 'searchMembers' })
	}
	handleChange() {
		this.setState({
			keyword: this.searchInput.value
		});
	}
	handleKeyDown(e) {
		if (e.keyCode === 13) {
			this.searchInput.blur();
			this.search();
		}
	}
	render() {
		const { keyword } = this.state;
		const { placeholder } = this.props;

		return (
			<div styleName="search_block">
				<div styleName="search_input">
					<ul>
						<li>
							<input
								ref={ _ref => (this.searchInput = _ref) }
								onChange={ this.handleChange }
								onKeyDown={ this.handleKeyDown }
								placeholder={ placeholder }
								value={ keyword }
							/>
						</li>
						<li onClick={ this.search }>
							<i className="search icon" />
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

GroupSearch.propTypes = {
	placeholder: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
	const nowState = state.group;
	return {
		searching: getGroupMemberSearchKey(nowState) !== '',
	}
};

export default compose(
	connect(mapStateToProps, { triggerSearch }),
  //translate([]),
  [CSSModules, '_', css]
)(GroupSearch);
