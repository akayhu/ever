import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import css from './itemUnit/item.css';
import EditTrigger from './itemUnit/editTrigger';
// import PrivacySetting from './itemUnit/privacySetting';
import FormHonor from './editformHonor';

class ItemHonor extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { editmode, itemData } = this.props;
		if (editmode) return <FormHonor />;
		return (
			<div styleName="itemContentHonor">
				<div styleName="tag">{itemData.tagList[0]}</div>
				<div styleName="titleBlock">
					<div styleName="title" className="h1">
						{itemData.title}
						{
							this.props.viewas === 'self' &&
							<EditTrigger editTrigger={ () => this.jobNoteMore() } delTrigger={ () => this.jobNoteMore() } />
						}
						{/*
              this.props.viewas === 'self' &&
              <PrivacySetting />
            */}
					</div>
				</div>
				<div styleName="descBlock">
					<div styleName="relation">
						{ itemData.relationDesc }
					</div>
					<div styleName="viewAll">{ itemData.startTime }{ itemData.endTime }</div>
					<div styleName="jobNote">
						<div styleName="jobNoteDesc">
							{itemData.description}
						</div>
					</div>
				</div>
				{/*
					this.state.seeMoreBtn &&
					<div ref="jobNoteMore" styleName="jobNoteMore">
						<a onClick={ this.jobNoteMore.bind(this) }>看更多</a>
					</div>
				*/}
			</div>
		);
	}
}

ItemHonor.propTypes = {
	itemData: PropTypes.object.isRequired,
	editmode: PropTypes.bool,
};

ItemHonor.defaultProps = {
	itemData: {},
	editmode: false,
};


export default CSSModules(ItemHonor, css, { allowMultiple: true });
