import React, { PureComponent, Component } from 'react';
import Ajv from 'ajv';
import decorateComponentWithProps from 'decorate-component-with-props';
import PropTypes from 'prop-types';
import { FontIcon } from 'material-ui';
import Modal from 'containers/modal';
import {
	ModalTitle,
	GrayBorderButtonWhiteBackground,
	SubmitButton,
} from 'share/styledComponents';
import './style.scss';

const ajv = new Ajv();

/**
 * Link Input Panel in InlineToolbar
 */
class LinkPanel extends Component {
	static propTypes = {
		link: PropTypes.string,
		onLinkPanelOpen: PropTypes.func,
		onLinkPanelClose: PropTypes.func,
		onSaveLink: PropTypes.func,
		onRemoveLink: PropTypes.func,
		onOverrideContent: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			link: props.link || '',
			showUrlAlert: false,
		};
		this.validateTimer = null;
	}

	componentDidMount = () => {
		this.refs.input.focus();
	};

	// NOTE: 用來將 focus 留在 editor 中
	onMouseDown = e => e.preventDefault();

	handleClose = () => {
		this.props.onOverrideContent(undefined);
		this.props.onLinkPanelClose();
	};

	handleSaveLink = () => {
		this.removeUrlValidate();
		if (!this.isValidUrl(this.state.link)) {
			this.setState({ showUrlAlert: true }, () => {
				this.refs.input.focus();
			});
			return;
		}
		this.setState({ showUrlAlert: false }, () => {
			this.props.onSaveLink(this.state.link);
			this.handleClose();
		});
	};

	handleRemoveLink = () => {
		this.props.onRemoveLink();
		this.handleClose();
	};

	handleOnChange = e => {
		this.setState({ link: e.target.value }, () => {
			this.removeUrlValidate();
			this.registerUrlValidate();
		});
	};

	handleOnKeydown = e => {
		if (e.which === 13) {
			e.preventDefault();
			this.handleSaveLink();
		}
	};

	isValidUrl = url => {
		const schema = {
			type: 'string',
			format: 'uri',
			minLength: 1,
		};
		return ajv.validate(schema, url);
	};

	registerUrlValidate = () => {
		this.validateTimer = setTimeout(() => {
			this.validateTimer = null;
			this.setState({ showUrlAlert: !this.isValidUrl(this.state.link) });
		}, 1000);
	};

	removeUrlValidate = () => {
		if (this.validateTimer) {
			clearTimeout(this.validateTimer);
			this.validateTimer = null;
		}
	};

	render() {
		return (
			<Modal className="modal-link" onMouseDown={this.onMouseDown}>
				<ModalTitle>編輯連結</ModalTitle>
				<FontIcon
					className="icon-icon_cancel"
					onClick={this.handleClose}
					style={{
						position: 'absolute',
						top: '20px',
						right: '20px',
					}}
				/>
				<input
					className="modal-link__input"
					ref="input"
					placeholder="https://plus.104.com.tw"
					defaultValue={this.state.link}
					onKeyDown={this.handleOnKeydown}
					onChange={this.handleOnChange}
				/>
				{this.state.showUrlAlert && (
					<p className="modal-link__alert">請輸入合法的完整網址</p>
				)}
				<GrayBorderButtonWhiteBackground
					className="modal-link__action"
					onClick={this.handleRemoveLink}
				>
					移除
				</GrayBorderButtonWhiteBackground>
				<SubmitButton
					className="modal-link__action"
					onClick={this.handleSaveLink}
				>
					儲存
				</SubmitButton>
			</Modal>
		);
	}
}

/**
 * Link Button in InlineToolbar
 */
class LinkButton extends PureComponent {
	static propTypes = {
		link: PropTypes.string,
		onLinkPanelOpen: PropTypes.func,
		onLinkPanelClose: PropTypes.func,
		onSaveLink: PropTypes.func,
		onRemoveLink: PropTypes.func,
		onOverrideContent: PropTypes.func.isRequired,
	};

	static defaultProps = {
		link: '',
		onLinkPanelOpen: () => {},
		onLinkPanelClose: () => {},
		onSaveLink: () => {},
		onRemoveLink: () => {},
	};

	openLinkPanel = () => {
		this.props.onOverrideContent(
			decorateComponentWithProps(LinkPanel, this.props)
		);
		this.props.onLinkPanelOpen();
	};

	// NOTE: 用來將 focus 留在 editor 中
	onMouseDown = e => e.preventDefault();

	render() {
		return (
			<div className="link-plugin" onMouseDown={this.onMouseDown}>
				<button className="link-plugin__button" onClick={this.openLinkPanel}>
					<i className="icon-icon_insert_link" />
				</button>
			</div>
		);
	}
}

export default LinkButton;
