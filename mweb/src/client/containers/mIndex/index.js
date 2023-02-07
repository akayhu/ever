import { connect } from 'react-redux';
import React from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { forEach } from 'lodash/collection';
import { DropdownMenu, DropdownTarget, DropdownList } from 'c_wap_module';
import HaveActionActivityList from 'src/client/components/activity/river';
import { initMainPage, changeMainTab } from 'src/client/actions/main';
import { loadListDataCenter } from 'src/client/actions/general';
import compose from 'src/util/compose';
import Welcome from './welcome';
import Announcement from 'src/client/components/announcement/index';

class MIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			option: 'hot',  // Hot, New, All
		};
		this.optionDesc = {
			hot: '熱門動態',
			latest: '最新動態',
			all: '全部動態'
		};
		this.typeList = 'cb7c5df0-d577-40f1-bc00-12fb1bbfff7f';
	}
	componentDidMount() {
		if(!this.props.user.isLogin){
			window.welcomeInit();
		}else{
			this.props.initMainPage(this.typeList, this.optionDesc).then(()=>{
				window.scrollTo(0, 0);
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.config !== nextProps.config) {
			forEach(Object.keys(this.optionDesc), (value) => {
				if (this.optionDesc[value] === nextProps.config[this.typeList]) {
					this.setState({
						option: value
					})
				}
			})
		}
	}
	selectOption(option) {
		this.props.changeMainTab(option, this.optionDesc[option], this.typeList);
		this.setState({ option });
		window.scrollTo(0, 0);
	}
	loadMore() {
		// console.log(this.state.option);
		this.props.loadListDataCenter({
			domain: 'main',
			key: this.state.option
		});
	}
	render() {
		if(!this.props.user.isLogin){
			return (
				<Welcome />
			);
		}
		
		const { loading, error, end } = this.props;
		const { option } = this.state;
		const dataList = this.props.main[option].dataList || [];

		return (
			<main styleName="wrap">
				<Announcement />
				<div styleName="option_dropdown">
					<DropdownMenu>
						<DropdownTarget>
							<span>{ this.optionDesc[option] }</span><i className="dropdown icon" />
						</DropdownTarget>
						<DropdownList>
							<ul styleName="dropdown_list">
								{
									Object.keys(this.optionDesc).map((key) => {
										return (
											<li key={key} onClick={ this.selectOption.bind(this, key) } data-gtm-index={this.optionDesc[key]}>{this.optionDesc[key]}</li>
										);
									})
								}
							</ul>
						</DropdownList>
					</DropdownMenu>
				</div>
				<HaveActionActivityList
					loading={ loading }
					error={ error }
					end={ end }
					dataList={ dataList }
					loadingAct={ this.loadMore.bind(this) }
					from="首頁"
					pageName="index"
				/>
			</main>
		);
	}
}

function mapStateToProps(state) {
	// console.log(state.main.tab);
	// console.log(state.main[state.main.tab]);
	return {
		user: state.user,
		main: state.main,
		loading: state.main[state.main.tab].loading,
		error: state.main[state.main.tab].error,
		end: state.main[state.main.tab].end,
		config: state.profile.config
	};
}

export default compose(
	connect(mapStateToProps, { initMainPage, changeMainTab, loadListDataCenter }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }]
)(MIndex);
