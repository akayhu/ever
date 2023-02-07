import { connect } from 'react-redux';
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import ga from 'react-ga';
import PeopleList from 'src/client/components/peopleList';
import LazyLoading from 'src/util/lazyLoading';
import { loadListDataCenter, resetList } from 'src/client/actions/general';

class SearchPeople extends Component {
	constructor(props) {
		super(props);
		this.keyword = '';
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.mode === '' || (nextProps.mode !== '' && nextProps.mode !== 'person')){
			return;
		}
		
		if (nextProps.keyword !== "" && this.keyword !== nextProps.keyword) {
			const { pid, loadListDataCenter, resetList } = this.props;
			this.keyword = nextProps.keyword;
			resetList({domain: 'search', key: 'person'});
			loadListDataCenter({domain: 'search', key: 'person', keyword: nextProps.keyword, pid});
		}
	}
	loadMore() {
		if(this.props.mode === '' || (this.props.mode !== '' && this.props.mode !== 'person')){
			return;
		}
		
		if(this.keyword){
			const { pid, loadListDataCenter } = this.props;
			loadListDataCenter({domain: 'search', key: 'person', keyword: this.keyword, pid});
		}
	}
	render() {
		const {total, loading, dataList, error, end, hasButton} = this.props;

		return (
			<div>
				{
					!loading && total > 0 && this.keyword &&
					<div styleName="total_count">共 {total} 人物符合搜尋結果</div>
				}
				{
					!loading && total === 0 && this.keyword &&
					<div styleName="no_result">
						<div styleName="msg">
							找不到符合「<span className="search_hightlight">{this.keyword}</span>」的搜尋結果
						</div>
						<div styleName="suggest">建議：檢查有沒有錯別字、或試試搜尋其他的字詞</div>
					</div>
				}
				<PeopleList
					loading={ loading }
					error={ error }
					end={ end }
					dataList={dataList}
					hasButton={this.props.hasButton}
					loadingAct={ this.loadMore.bind(this) }
				/>
			</div>
		);
	}
}

function mapStateToProps(state, props) {
	return {
		pid: state.user.pid,
		total: state.search.person.total,
		loading: state.search.person.loading,
		error: state.search.person.error,
		end: state.search.person.end,
		dataList: state.search.person.dataList,
	};
}

export default compose(
	connect(mapStateToProps, { loadListDataCenter, resetList }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(SearchPeople);
