import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import ItemEdu from './component/itemEdu';
import FormEdu from './component/editformEdu';
import ShowMoreBtn from './component/itemUnit/showMoreBtn';
import { viewDataProcessing } from './util.js';
import PersonalInfoComponentTitle from 'src/client/component_profile/title/personalInfo';

class ChronicleEDU extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAllFlag: true,
		};
		this.showAllTrigger = this.showAll.bind(this);
	}
	showAll() {
		this.setState({ showAllFlag: false });
	}
	render() {
		const { dataArray } = this.props;
		return (
			<div id="education">
				{
					(dataArray.length > 0 || this.props.promotion === 'education') &&
					<PersonalInfoComponentTitle
						createButton={ this.props.viewas === 'self' }
						maintitle="學歷"
						privacy={ this.props.privacy }
						privacyText="experience"
						showPrivacySetting={ this.props.viewas === 'self' }
						addBtnClick={ () => this.showAllFlag() }
						gtmValue="新增學歷"
					/>
				}
				{
					this.props.promotion === 'education' &&
					<FormEdu />
				}
				{
					dataArray.map((obj, index) => {
						const showCircle = (index === 0) ? true : dataArray[index].startYear !== dataArray[index - 1].startYear;
						if (index < 2 || !this.state.showAllFlag) {
							return (
								<ItemEdu
									key={ obj.eventId }
									index={ index }
									itemData={ viewDataProcessing(obj) }
									isFirst={ index === 0 }
									viewas={ this.props.viewas }
									editmode={ this.props.promotion === `education${index}` }
									tempData={ obj.type === 'edu-temp' }
									showCircle={ showCircle }
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
							text="學歷"
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

export default CSSModules(ChronicleEDU, css, { allowMultiple: true });
