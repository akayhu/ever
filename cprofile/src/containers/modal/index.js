import { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const modalRoot = document.getElementById('modal-root');

class Modal extends PureComponent {
	constructor(props) {
		super(props);
		this.el = document.createElement('div');
		this.el.className = props.className || 'modal-container';
		this.el.onclick = e => e.preventPropagation;
	}
	componentDidMount() {
		modalRoot.appendChild(this.el);
	}
	componentWillUnmount() {
		modalRoot.removeChild(this.el);
	}
	render() {
		return ReactDOM.createPortal(this.props.children, this.el);
	}
}

export default Modal;
