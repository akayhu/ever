import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import compose from 'src/util/compose';
import css from './index.css';
import { merge } from 'lodash/object';
import { reduce, forEach } from 'lodash/collection';

// config
import getConfig from './personalPrivacyConfig';

// components
import PrivacyForm from './privacyForm';

class PersonalPrivacy extends Component {
	constructor(props) {
		super(props);
		this.state = {
			personalPrivacys: getConfig(this.props.privacy, this.props.lightboxPackage),
		};
	}
	componentWillReceiveProps(nextProps) {
		// // 當loading是false時不更新personalPrivacys，不然在儲存變更 switch會先render一次原本的值(跑回原本的值再跑回來)
		if (nextProps.loading) return;
		if (this.props.privacy !== nextProps.privacy) {
			this.setState({
				personalPrivacys: getConfig(nextProps.privacy, this.props.lightboxPackage),
			});
		}
	}
	handleTogglePrivacy(status, arrayIndex, keyIndex, type) {
		// 點擊switch或droplist要去改變state
		let typeStatus = 0;
		if (type === 'switch') {
			typeStatus = status === 1 ? 0 : 1;
		} else if (type === 'droplist') {
			typeStatus = status;
		}
		// 每次更新都重傳一個新的state
		this.setState(previousState =>
			merge({}, previousState, {
				personalPrivacys: {
					[arrayIndex]: {
						navList: {
							[keyIndex]: {
								status: typeStatus
							}
						}
					}
				}
			})
		);
	}
	makeUpdatePrivacyData(event) {
		// 做出要送至api的資料格式
		event.preventDefault();
		const resultData = reduce(this.state.personalPrivacys, (result, personalPrivacy) => {
			forEach(personalPrivacy.navList, (privacy) => {
				result[privacy.key] = privacy.status;
			});
			result.pid = this.props.pid;
			return result;
		}, {});
		this.props.handleUpdatePrivacy(resultData);
	}
	render() {
		const { useLightbox, lightboxDesc, handleLightBoxOpen } = this.props;
		return (
			<div>
				{
					useLightbox &&
					<p styleName="lightboxDesc">{ lightboxDesc }</p>
				}
				<div styleName={ useLightbox ? 'privacy_form_lb' : '' }>
					{
						this.state.personalPrivacys.map((personalPrivacy, index) => (
							<PrivacyForm
								key={ index }
								useLightbox={ useLightbox }
								arrayIndex={ index }
								nav={ personalPrivacy.nav }
								navList={ personalPrivacy.navList }
								makeUpdatePrivacyData={ this.makeUpdatePrivacyData.bind(this) }
								handleTogglePrivacy={ this.handleTogglePrivacy.bind(this) }
								loading={ this.props.loading }
							/>
						))
					}
				</div>
				{
					useLightbox &&
					<div styleName="footer">
						<button
							className={ `ui primary button ${this.props.loading ? 'loading' : ''}` }
							onClick={ this.makeUpdatePrivacyData.bind(this) }
						>
							儲存變更
						</button>
						<button
							className="ui normal button"
							onClick={ handleLightBoxOpen.bind(this, false) }
						>
							取消
						</button>
					</div>
				}
			</div>
		);
	}
}

PersonalPrivacy.propTypes = {
	useLightbox: PropTypes.bool.isRequired,
	lightboxPackage: PropTypes.string,
	lightboxDesc: PropTypes.string,
	handleUpdatePrivacy: PropTypes.func.isRequired,
	handleLightBoxOpen: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		pid: state.user.pid,
		privacy: state.privacy,
		loading: state.privacy.loading
	};
}

export default compose(
	connect(mapStateToProps, null),
	[CSSModules, '_', css, { allowMultiple: true }]
)(PersonalPrivacy);
