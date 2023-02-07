import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import style from './style.css';
import Overlay from '../../utils/overlay';
import ReactDOM from 'react-dom';

let position = {};

class List extends Component{
	componentDidMount() {
	}
	
    render(){
        return(
            <div>
                <Overlay 
                        onRequestClose={this.props.clickAway}>
                </Overlay>
				  
                <ul styleName="list" style={{ width: this.props.width }} className="Droplist_list">
                    { this.props.children } 
                </ul>
            </div>
        );
    }
}

export default CSSModules(List,style,{allowMultiple:true});