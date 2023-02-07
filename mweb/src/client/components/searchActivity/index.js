import { connect } from 'react-redux';
import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';
import { translate } from 'react-i18next';
import compose from 'src/util/compose';
import ga from 'react-ga';
import { loadListDataCenter } from 'src/client/actions/general';
import NoActionActivityList from 'src/client/components/activity/list';

class SearchActivity extends Component {
	constructor(props) {
		super(props);
		this.keyword = '';
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.mode === '' || (nextProps.mode !== '' && nextProps.mode !== 'activity')){
			return;
		}
		
		if (nextProps.keyword !== "" && this.keyword !== nextProps.keyword) {
			const { pid, loadListDataCenter } = this.props;
			this.keyword = nextProps.keyword;
			loadListDataCenter({domain: 'search', key: 'activity', keyword: nextProps.keyword, pid});
		}
	}
	loadMore() {
		if(this.props.mode === '' || (this.props.mode !== '' && this.props.mode !== 'activity')){
			return;
		}
		
		if(this.keyword){
			const { pid, loadListDataCenter } = this.props;
			loadListDataCenter({domain: 'search', key: 'activity', keyword: this.keyword, pid});
		}
	}
	render() {
		const {total, loading, dataList, error, end} = this.props;

		return (
			<div>
				{
					!loading && total > 0 && this.keyword &&
					<div styleName="total_count">共 {total} 篇文章符合搜尋結果</div>
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
				<NoActionActivityList 
					loading={ loading }
					error={ error }
					end={ end }
					dataList={ dataList } 
					loadingAct={ this.loadMore.bind(this) } 
					from="搜尋結果"
					pageName="search"
					filter={ this.keyword }
				/>
			</div>
		);
	}
}

function mapStateToProps(state, props) {

	return {
		pid: state.user.pid,
		total: state.search.activity.total,
		loading: state.search.activity.loading,
		error: state.search.activity.error,
		end: state.search.activity.end,
		dataList: state.search.activity.dataList,
	};
}

export default compose(
	connect(mapStateToProps, { loadListDataCenter }),
	// translate([]),
	[CSSModules, '_', css, { allowMultiple: true }],
)(SearchActivity);
