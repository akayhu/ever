import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { NameCard } from 'src/client/component_common/card';

class EndorseListNameCard extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { pid, myPid, avatarWebUrl, userName } = this.props;
		return (
			<div styleName="other_shelfies">
				<NameCard
					filter={ myPid }
					targetPid={ myPid }
					href={ `/profile/${pid}` }
					imgSrc={ avatarWebUrl }
					name={ userName }
					avatarSize={ 27 }
				/>
			</div>
		);
	}
}

export default (CSSModules(EndorseListNameCard, css, {allowMultiple: true}));
