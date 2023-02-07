import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './itemUnit/item.css';
import Item from './itemUnit/item.js';
import EditTrigger from './itemUnit/editTrigger';
// import PrivacySetting from './itemUnit/privacySetting';
import FormEdu from './editformExp';

class ItemEdu extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { editmode, tempData, itemData } = this.props;
		if (editmode) return <FormEdu />;
		return (
			<Item
				startYear={ (this.props.isFirst) ? 'Now' : itemData.startYear }
				tempData={ tempData }
				showCircle={ this.props.showCircle }
			>
				<div styleName="titleBlock">
					<div styleName="title" className="h1">
						{ itemData.schoolName }{ itemData.eduArea }
						{
							this.props.viewas === 'self' &&
							<EditTrigger />
						}
						{/*
							this.props.viewas === 'self' &&
							<PrivacySetting />
						*/}
					</div>
				</div>
				<div styleName="descBlock">
					<div>{ itemData.major }</div>
					<div styleName="viewAll">
						{
							!tempData &&
							`${itemData.startTime}${itemData.endTime}`
						}
					</div>
				</div>
			</Item>
		);
	}
}

ItemEdu.propTypes = {
	itemData: PropTypes.object.isRequired,
	editmode: PropTypes.bool,
	tempData: PropTypes.bool,
};

ItemEdu.defaultProps = {
	itemData: {},
	editmode: false,
	tempData: false,
};


export default CSSModules(ItemEdu, css, { allowMultiple: true });
