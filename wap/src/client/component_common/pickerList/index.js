import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import CSSModules from 'react-css-modules';
import css from './index.css';


class PickerList extends Component {

	constructor(props, context){
		super(props, context);
		this.state = {
			items: this.props.items
		};
		// 因為gallerySortList response 一方為空值時沒有屬性所以做以下判斷
		if (!this.props.items.hasOwnProperty('top')) {
			this.state.items.top = [];
		}
		if (!this.props.items.hasOwnProperty('other')) {
			this.state.items.other = [];
		}
	}

	componentWillMount() {
		this.props.GetFunction(this.state.items);
	}

	componentDidMount() {
		var $ = window.$;
		let that = this;
		$("." + css.selected_items).sortable();
		$("." + css.selected_items).on('sortstop',function(){
			let sortArray = $(this).sortable('toArray');
			//  get 從available_items 送到 selected_items時 sortstop array會少一個
			if (that.state.items.top.length !== sortArray.length) {
				sortArray.push(String(sortArray.length));
			}
			that.state.items.top.map((item, key) => {
				// 先轉型態變字串找出在array中的位置，因為api順序起始是1所以再轉回數字+1
				item["sortIndex"] = Number(sortArray.indexOf(String(key))) + 1;
			})
		});
	}

	handleSelected(item, key) {
		if (this.state.items.top.length >= this.props.maxAmounts) {
			return
		}
		this.state.items.top.push(this.state.items.other[key]);
		this.state.items.other.splice(key, 1);
		this.setState(this.state.items);
		$("." + css.selected_items).trigger('sortstop');
	}

	handleRemove(item, key) {
		this.state.items.other.push(this.state.items.top[key]);
		this.state.items.top.splice(key, 1);
		this.setState(this.state.items);
		$("." + css.selected_items).trigger('sortstop');
	}

	render() {
		const { availableItems, selectedItems, maxAmounts } = this.props;
		let that = this;
		this.state.items = Object.assign({}, this.props.items);
		return (
			<div>
				<div>
					<div styleName="list">
						<p styleName="text-left">{ availableItems }</p>
					</div>
					<div styleName="list text-left">
						<p>{ selectedItems }</p>
					</div>
				</div>
				<div className="clearfix" styleName="picker_list">
					<ul styleName="available_items">
						{
							this.state.items.other &&
							this.state.items.other.map(function (item, key) {
								return (
								<li key={key} styleName="item">
									{
										item.filePath &&
										<img src={ item.filePath } />
									}
									<span>{ item.title || item.item }</span>
									<i
										onClick={ that.handleSelected.bind(that, item, key) }
										className="chevron move_right_circle icon"
										>
									</i>
								</li>
								)
							})
						}
					</ul>
					<ul ref="selected_items" styleName="selected_items">
						{
							this.state.items.top &&
							this.state.items.top.map(function (item, key) {
								return (
								// id是給sortalbe用的
								<li key={key} id={key} styleName="item">
									{
										item.filePath &&
										<img src={ item.filePath } />
									}
									<span>{ item.title }{ item.item }</span>
									<i
										onClick={ that.handleRemove.bind(that, item, key) }
										className="cross_circle icon"
										>
									</i>
								</li>
								)
							})
						}
					</ul>
				</div>
				{
					<div>
						<div styleName="list"></div>
						<div styleName="list">
								<div styleName="list text-left" style={{color: "#FF530E"}}>
									{ this.state.items.top.length === maxAmounts  &&
										<span>已經選滿{ maxAmounts }筆</span>
									}
								</div>
							<div styleName="list text-right">
								<span style={{color: "#FF530E"}}>{ this.state.items.top.length }</span>
								<span style={{color: "#A9A9A9"}}> / { maxAmounts }</span>
							</div>
						</div>
					</div>
				}
			</div>
		);
		// return (
		// 	<div className="clearfix" styleName="picker_list">
		// 		coming soon....
		// 	</div>
		// );
	}
}

PickerList.propTypes = {
	items: PropTypes.object,
	GetFunction: PropTypes.func,
	availableItems: PropTypes.string,
	selectedItems: PropTypes.string,
	maxAmounts: PropTypes.number
}

const PickerListCss = CSSModules(PickerList,css,{allowMultiple: true})
const PickerListTranslate = translate([])(PickerListCss);

export default PickerListTranslate;
