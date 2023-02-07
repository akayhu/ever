import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import ItemExp from './component/itemExp';
import FormExp from './component/editformExp';
import ShowMoreBtn from './component/itemUnit/showMoreBtn';
import { viewDataProcessing } from './util.js';
import PersonalInfoComponentTitle from 'src/client/component_profile/title/personalInfo';

class ChronicleEXP extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAllFlag: true,
		};
		this.showAllTrigger = this.showAll.bind(this);
		this.createTrigger = () => this.props.editTrigger('experience');
		this.editTrigger = e => this.props.editTrigger(e);
		this.delTrigger = () => this.props.delTrigger('experience');
	}
	showAll() {
		this.setState({ showAllFlag: false });
	}
	render() {
		const { dataArray } = this.props;
		return (
			<div id="experience">
				{
					(dataArray.length > 0 || this.props.promotion === 'experience') &&
					<PersonalInfoComponentTitle
						createButton={ this.props.viewas === 'self' }
						maintitle="經歷"
						privacy={ this.props.privacy }
						privacyText="experience"
						showPrivacySetting={ this.props.viewas === 'self' }
						addBtnClick={ this.createTrigger }
						gtmValue="新增經歷"
					/>
				}
				{
					this.props.promotion === 'experience' &&
					<FormExp createMode cancelTrigger={ this.editTrigger } />
				}
				{
					dataArray.map((obj, index) => {
						const showCircle = (index === 0) ? true : dataArray[index].startYear !== dataArray[index - 1].startYear;
						if (index < 2 || !this.state.showAllFlag) {
							return (
								<ItemExp
									key={ obj.eventId }
									index={ index }
									itemData={ viewDataProcessing(obj) }
									isFirst={ index === 0 }
									viewas={ this.props.viewas }
									editmode={ this.props.promotion === `experience${index}` }
									tempData={ obj.type === 'exp-temp' }
									showCircle={ showCircle }
									editTrigger={ this.editTrigger }
									delTrigger={ this.delTrigger }
								/>
							);
						}
					})
				}
				{
					(dataArray.length > 2 && this.state.showAllFlag) &&
						<ShowMoreBtn
							showAllTrigger={ this.showAllTrigger }
							total={ dataArray.length }
							text="經歷"
						/>
				}
				{
					dataArray.length > 0 &&
					<hr styleName="chronicle_hr" />
				}
			</div>
		);
	}
}

export default CSSModules(ChronicleEXP, css, { allowMultiple: true });
