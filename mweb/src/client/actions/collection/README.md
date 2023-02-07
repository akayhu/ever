### Actions:
	- initCollectionPage - 點入我的收藏時要先初始化頁面

### 主要行為
```javascript
// 點選職場動態時要先去載入訂閱過的職務類別
this.props.initCollectionPage()

//載入更多我收藏的文章時使用
this.props.loadListDataCenter({domain: 'collection', key: 'activity'})
```

### 相關STORE位置
  - state.collection
  - state.entities.activities

### DOMAIN
	- collection

### KEY
	- activity