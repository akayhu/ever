### Actions:
- triggerLike - 當對文章案下cool時用
- triggerCollect - 當對文章案下收藏時用
- initSinglePage - 開啟文章獨立頁時使用


### 主要行為
```javascript
// 按下cool按鈕
this.props.triggerLike(true, {aid, aidParent})

// 按下收藏按鈕
this.props.triggerCollect(true, {aid, aidParent})

// 初始化獨立頁
this.props.initSinglePage(aid)
```

### 相關STORE位置
  - state.entities.activities