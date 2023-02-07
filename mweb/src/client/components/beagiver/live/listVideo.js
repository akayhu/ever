import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import css from './index.css';

class ListVideo extends Component {
	constructor(props) {
		super(props);
    this.state = {
			showItem: 6
		};
	}
  more() {
		this.setState({	showItem: this.state.showItem + 6	});
	}
	render() {
		const { data } = this.props;
		const { showItem } = this.state;
		const dataTotal = data.length;
		return (
			<div styleName="listVideo">
        <div styleName="listVideoTitle">更多剪影</div>
				<ul>
					{
						data.map((item, index) => {
							if (index < showItem && index < dataTotal) {
								return (
									<li key={ item.youtube }>
                    <div styleName="listIframe">
                      <iframe
                        src={ `https://www.youtube.com/embed/${item.youtube}` }
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
										<div styleName="listVideoDataTitle">{ item.title }</div>
									</li>
								);
							}
						})
					}
				</ul>
        <div styleName="button">
          {
						this.state.showItem < dataTotal &&
						<a 
							styleName="more" 
							data-gtm-giver="活動剪影-顯示更多" 
							href="javascript:void(0)" 
							onClick={ () => this.more() }
						>
							顯示更多
						</a>
					}
					<a 
						styleName="join" 
						data-gtm-giver="活動剪影-加入我們" 
						href="https://jr3j.app.link/LOXt9l3x7v" 
						target="_blank"
					>
						加入我們
					</a>
        </div>
			</div>
		);
	}
}

export default CSSModules(ListVideo, css, {allowMultiple: true});
