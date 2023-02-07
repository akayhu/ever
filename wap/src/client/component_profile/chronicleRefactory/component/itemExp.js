import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './itemUnit/item.css';
import Item from './itemUnit/item.js';
import EditTrigger from './itemUnit/editTrigger';
// import PrivacySetting from './itemUnit/privacySetting';
import FormExp from './editformExp';

class ItemExp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			seeMoreBtn: false
		};
		this.editTrigger = () => this.props.editTrigger(`experience${this.props.index}`);
		this.cancelTrigger = () => this.props.editTrigger('none');
	}
	componentDidMount() {
		// this.setState({ seeMoreBtn: (this.refs.jobNoteDesc.clientHeight > this.refs.jobNote.clientHeight) });
	}
	jobNoteMore() {
		// this.setState({ seeMoreBtn: false });
	}
	render() {
		const { editmode, tempData, itemData } = this.props;
		if (editmode) return <FormExp itemData={ itemData } cancelTrigger={ this.cancelTrigger } />;
		return (
			<Item
				startYear={ (this.props.isFirst) ? 'Now' : itemData.startYear }
				tempData={ tempData }
				showCircle={ this.props.showCircle }
			>
				<div styleName="titleBlock">
					<div styleName="title" className="h1">
						{ itemData.jobTitle }
						{
							this.props.viewas === 'self' &&
							<EditTrigger editTrigger={ this.editTrigger } delTrigger={ this.props.delTrigger } />
						}
						{/*
              this.props.viewas === 'self' &&
              <PrivacySetting />
            */}
					</div>
					<div styleName="title" className="h5">{ itemData.companyName }{ itemData.expArea }</div>
				</div>
				<div styleName="descBlock">
					<div styleName="viewAll">
						{
							!tempData &&
							`${itemData.startTime}${itemData.endTime}`
						}
						{ itemData.desc }
					</div>
					<div styleName="jobNote">
						<div styleName="jobNoteDesc">
							{
								itemData.jobNote !== null &&
								itemData.jobNote.split('\n').map((item, index) => {
									return (<span key={ index }>{ item }<br /></span>)
								})
							}
							{
								this.state.seeMoreBtn &&
								<div styleName="bottom_shadow" />
							}
						</div>
					</div>
					{
						this.state.seeMoreBtn &&
						<div styleName="jobNoteMore">
							<a onClick={ this.jobNoteMore.bind(this) }>看詳細</a>
						</div>
					}
				</div>
			</Item>
		);
	}
}

ItemExp.propTypes = {
	itemData: PropTypes.object.isRequired,
	editmode: PropTypes.bool,
	tempData: PropTypes.bool,
};

ItemExp.defaultProps = {
	editmode: false,
	tempData: false,
};

export default CSSModules(ItemExp, css, { allowMultiple: true });
