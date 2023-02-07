import React, { Component, Fragment } from 'react';
import { Tag, Input, Tooltip, Icon } from 'antd';
import './style.scss';

class Tags extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: this.props.tagsData || [],
			inputVisible: false,
			inputValue: '',
			placeHolder: props.placeHolder || '新增技能標籤',
		};
	}

	_handleClose = removedTag => {
		const tags = this.state.tags.filter(tag => tag !== removedTag);
		this.setState({ tags });
		this._handleTagsSubmit(tags);
	};

	_showInput = () => {
		this.setState({ inputVisible: true }, () => this.input.focus());
	};

	_handleTagsSubmit = tags => {
		this.props.onTagsSubmit(tags);
	};

	_handleInputChange = e => {
		this.setState({ inputValue: e.target.value });
	};

	_handleInputConfirm = () => {
		const state = this.state;
		const inputValue = state.inputValue;
		let tags = state.tags;
		if (inputValue && tags && tags.indexOf(inputValue) === -1) {
			tags = [...tags, inputValue];
		}
		this.setState(
			{
				tags,
				inputVisible: false,
				inputValue: '',
			},
			() => {
				this._handleTagsSubmit(this.state.tags);
			}
		);
	};

	_saveInputRef = input => (this.input = input);

	render() {
		const { tags, inputVisible, inputValue, placeHolder } = this.state;
		const { edit, commonMode } = this.props;
		return (
			<div className="tag-main">
				{tags &&
					tags.map((tag, index) => {
						const isLongTag = tag.length > 20;
						const tagElem = (
							<Tag
								key={`${tag}-${index}`}
								closable={edit}
								onClose={() => this._handleClose(tag)}
							>
								{!commonMode && (
									<a
										href={`/search?q=${tag}`}
										target="_blank"
										title={`${tag}`}
										rel="noopener noreferrer"
									>
										{isLongTag ? `# ${tag.slice(0, 20)}...` : `# ${tag}`}
									</a>
								)}
								{commonMode && (
									<Fragment>
										{isLongTag ? `# ${tag.slice(0, 20)}...` : `# ${tag}`}
									</Fragment>
								)}
							</Tag>
						);
						return isLongTag ? (
							<Tooltip title={tag} key={tag}>
								{tagElem}
							</Tooltip>
						) : (
							tagElem
						);
					})}
				{inputVisible && (
					<Input
						ref={this._saveInputRef}
						type="text"
						size="small"
						style={{ width: 78 }}
						value={inputValue}
						onChange={this._handleInputChange}
						onBlur={this._handleInputConfirm}
						onPressEnter={this._handleInputConfirm}
					/>
				)}
				{!inputVisible && edit && (
					<Tag onClick={this._showInput} style={{ borderStyle: 'dashed' }}>
						<Icon type="plus" /> {placeHolder}
					</Tag>
				)}
			</div>
		);
	}
}

export default Tags;
