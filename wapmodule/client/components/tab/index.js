import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import style from './style.css';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { isEqual } from 'lodash/lang';

class Tabs extends Component {
    constructor(props){
        super(props);
        this.state = {
            tabStack: [],
            currentTab: ''
        }
        this.tabClick = (e) => this._tabClick(e);
        this.mountTabs = this.mountTabs.bind(this);
    }
    componentDidMount(){
        this.mountTabs(this.props.children);
    }
    componentWillReceiveProps(nextProps) {
        const oldKeys = this.props.children.filter(child => child && child.props).map( child => child.props.text);
        const newKeys = nextProps.children.filter(child => child && child.props).map( child => child.props.text);
        if (!isEqual(oldKeys, newKeys)) {
            this.mountTabs(nextProps.children, 'staySameTab')
        }
    }
    mountTabs(childData, staySameTab) {
        let tabStack=[];
        React.Children.map(childData, function (child) {
            child && tabStack.push(child.props);
        });
        this.setState({
            tabStack: tabStack,
            currentTab: staySameTab ? this.state.currentTab : tabStack[0].name
        })
    }
    _tabClick(e) {
        this.setState({
            currentTab: e.target.getAttribute('name')
        })
        if( this.props.onChange ) this.props.onChange(this.state.currentTab, e.target.getAttribute('name'));
    }
    render(){
        let that = this;
        return (
            <div className={this.props.className}>
                <div styleName="head-body" id="tab-component-head">
                { this.state.tabStack && this.state.tabStack.map(function(item, index){
                        let active = that.state.currentTab === item.name ? 'active' : '';
                        return(
                            <div styleName={"tab-head "+active}
                                 style={{ width: 100/that.state.tabStack.length + '%'}}
                                 key={index} 
                                 onClick={that.tabClick} 
                                 name={item.name}>
                                 {item.text || item.name}
                            </div>
                        )
                    }) 
                }
                </div>
                <div styleName="container" className={this.props.className} id="tab-component-body">
                { React.Children.map(this.props.children, function (child) {
                    return child && React.cloneElement(child, {
                        currentTab: that.state.currentTab
                    });
                })}
                </div>
            </div>
        )
    }
}

export default CSSModules(Tabs,style,{allowMultiple:true});