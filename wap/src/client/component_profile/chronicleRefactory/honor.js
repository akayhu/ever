import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import ItemHonor from './component/itemHonor';
import FormHonor from './component/editformHonor';
import ShowMoreBtn from './component/itemUnit/showMoreBtn';
import { viewDataProcessing } from './util.js';
import PersonalInfoComponentTitle from 'src/client/component_profile/title/personalInfo';

class ChronicleHonor extends React.Component {
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
			<div id="honor">
				{
					(dataArray.length > 0 || this.props.promotion === 'honor') &&
					<PersonalInfoComponentTitle
						createButton={ this.props.viewas === 'self' }
						maintitle="成就"
						privacy={ this.props.privacy }
						privacyText="honor"
						showPrivacySetting={ this.props.viewas === 'self' }
						addBtnClick={ () => this.showAllFlag() }
						gtmValue="新增成就"
					/>
				}
				{
					this.props.promotion === 'honor' &&
					<FormHonor />
				}
				{
					dataArray.map((obj, index) => {
						if (index < 2 || !this.state.showAllFlag) {
							return (
								<ItemHonor
									key={ obj.eventId }
									index={ index }
									itemData={ viewDataProcessing(obj) }
									viewas={ this.props.viewas }
									editmode={ this.props.promotion === `honor${index}` }
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
							text="成就"
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

export default CSSModules(ChronicleHonor, css, { allowMultiple: true });
