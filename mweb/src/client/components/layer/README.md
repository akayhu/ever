# Layer
### 蓋台用

```javascript
<Layer
  backBtnText={ 返回鈕旁邊的字 }
  open={ 控制開關的state }
  onRequestClose={ layer關閉時要改變state的function }
>
  {要呈現的內容}
</Layer>
```

## Props
- #### *total: [String] - Default: "test"
> 返回按鈕旁邊的文字

- #### *open: [Boolean] - Default false
> 控制開關的state

- #### *onRequestClose: [Function]
> layer關閉時要改變state的function


#### 建議寫法

1. 在自己的component新增一個state
```javascript
  this.state = {
    show: false
  }
```

2. 新增一個控制layer的function
```javascript
  handleToggleLayer(value) {
    this.setState({
      show: value
    })
  }
```

3. 欲觸發layer開啟的位置
``` javascript
  <a onClick={ this.handleToggleLayer.bind(this, true) }>
    toggleLayer
  </a>
```

4. 新增layer及內容
``` javascript
  <Layer
    backBtnText="profile"
    open={ this.state.show }
    onRequestClose={ this.handleToggleLayer.bind(this) }
  >
    <h1>layer test</h1>
  </Layer>
```

完成掰掰e
