import React, { Component } from 'react';
import update from 'react-addons-update';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import { TextField } from 'c_wap_module';
import css from './index.css';

import TagItem from './tagItem';

class Tag extends Component {
	constructor(props) {
		super(props);

		this.state = {
			ACData: [],
			newTag: '',
			errorMessage: ''
		};

		this.addItem = this.addItem.bind(this);
		this.tagCheckVaild = this.tagCheckVaild.bind(this);
	}
	tagCheckVaild(value) {
		const { tagList } = this.props;

		if (value.length === 0 || value.trim() === '') {
			return false;
		}

		if (tagList.length >= 5) {
			this.setState({
				newTag: '',
				errorMessage: '最多增加5個標籤'
			});
			return false;
		}

		if (value.length >= 20) {
			this.setState({
				errorMessage: '最多輸入20個字元'
			});
			return false;
		}

		return true;
	}
	tagBlur() {
		if (this.props.hasOwnProperty('forceFromAc') && this.props.forceFromAc === true) {
			const data = this.state.ACData.find(data => data.value === this.state.newTag);
			if (data) {
				this.addItem(data);
			}
			this.setState({
				ACData: [],
				newTag: ''
			});
			return;
		}
		this.addItem(this.state.newTag);
	}
	tagChange(key, value) {
		this.setState({
			errorMessage: ''
		});

		const lastChar = value.slice(-1);

		// slice是為了去掉分號或逗號
		if (lastChar === ';' || lastChar === ',') {
			this.addItem(value.slice(0, -1));
			return;
		}

		if (this.props.hasOwnProperty('forceFromAc') && this.props.hasOwnProperty('autocomplete')) {
			const acData = this.props.autocomplete(value);
			this.setState({ newTag: value, ACData: acData });
		} else {
			this.setState({ newTag: value });
		}
	}
	tagKeyDown(e) {
		if (this.props.hasOwnProperty('forceFromAc') && this.props.forceFromAc === true) {
			return;
		}

		if (e.keyCode === 13 || e.keyCode === 186 || e.keyCode === 188) {
			this.addItem(this.state.newTag);
		}
	}
	handleSelected(value, index) {
		const data = this.state.ACData[index - 1] || {};
		this.addItem(data);
	}
	addItem(value) {
		const { tagList } = this.props;

		if (this.props.hasOwnProperty('forceFromAc') && this.props.forceFromAc === true) {
			const newTag = value.data;

			newTag.text = newTag.name;
			newTag.pid = newTag.id;

			if (ObjectCheckRepeat(newTag, tagList)) {
				const newTagList = update(tagList, {$push: [newTag]});

				this.props.activitySetTag(newTagList);
				this.setState({
					newTag: '',
					errorMessage: ''
				});
			} else {
				this.setState({
					newTag: '',
					errorMessage: '此標籤已經存在'
				});
			}
		} else {
			if (!this.tagCheckVaild(value)) {
				return;
			}

			if (tagCheckRepeat(value, tagList)) {
				const newTagList = update(tagList, {$push: [value]});

				this.props.activitySetTag(newTagList);
				this.setState({
					newTag: '',
					errorMessage: ''
				});
			} else {
				this.setState({
					newTag: '',
					errorMessage: '此標籤已經存在'
				});
			}
		}
	}
	deleteItem(index) {
		const tempArray = [...this.props.tagList];
		tempArray.splice(index, 1);
		this.props.activitySetTag(tempArray);
	}
	render() {
		const { tagList } = this.props;
		
		return (
			<div styleName="sub_function_row">
				<div styleName="container">
					{
						tagList &&
						tagList.map((item, index) =>
							<TagItem
								key={ index }
								text={ item.text || item }
								deleteItem={ () => this.deleteItem(index) }
							/>
						)
					}
					<div styleName="tag_textfield_block" title="你可以設定跟此篇文章相關的標籤">
						<TextField
							name="newTag"
							styleName="tag_textfield"
							value={ this.state.newTag }
							ACData={ this.state.ACData }
							placeHolder={ this.props.placeHolder || '請輸入要新增的標籤' }
							onBlur={ this.tagBlur.bind(this) }
							onChange={ this.tagChange.bind(this) }
							onKeyDown={ e => this.tagKeyDown(e) }
							onSelected={ this.handleSelected.bind(this) }
							errorMessage={ this.state.errorMessage }
							filterArray={ [';', ','] }
						/>
					</div>
				</div>
			</div>
		);
	}
}

function ObjectCheckRepeat(newTag, tagList) {
	let result = true;

	tagList.forEach((tag) => {
		if (tag.pid === newTag.pid) {
			result = false;
		}
	});

	return result;
}

function tagCheckRepeat(newTag, tagList) {
	let result = true;

	tagList.forEach((tag) => {
		if (tag === newTag) {
			result = false;
		}
	});

	return result;
}

export default connect(null, {})(CSSModules(Tag, css, { allowMultiple: true }));
