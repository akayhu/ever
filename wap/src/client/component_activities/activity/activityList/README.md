# ListBase
## Usage
### Activity 列表頁

![GITHUB](http://imgur.com/EszljPR.jpg "git圖示")

```javascript
<ListBase
  dataList={ dataList },
  loadMore={ this.loadMore.bind(this) }
  listBaseLoading={ this.state.listBaseLoading }
/>
```

## Props
- #### dataList: [Array]
> Activity 列表陣列

- #### loadMore: [Func]
> LazyLoading後要觸發的事件

- #### listBaseLoading: [Bool]
> 控制 轉轉小花
> 建議寫法看下面

````javascript
  loadMore() {
    this.setState({
      listBaseLoading: true
    });
    this.props.getPersonalWallMore(this.props.params.pid).then(() => {
      this.setState({
        listBaseLoading: false
      });
    });
  }

````
