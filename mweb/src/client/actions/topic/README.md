### Actions:
	- initSubscribeList - 取得使用者訂閱的職務類別
	- initTopicPage - 職場動態頁初始用
	- requestTopicData - 當topic要取得到非PageModel的資料使用的
	- receiveTopicData - 當topic接收到非PageModel的資料使用的
	- changeTopic - 切換職務列表時用的(for initTopicPage)
	- initTopicModel - 初始化state.topic.byFunc[func](for changeTopic)

### 主要行為
```javascript
// 點選職場動態時要先去載入訂閱過的職務類別
this.props.initSubscribeList()

//進入某個職場動態頁時要先初始化
this.props.initTopicPage(func)

//載入職場動態更多文章時使用
this.props.loadListDataCenter({domain: 'topic', key: 'hots', func})
```

### 相關STORE位置
  - state.topic
  - state.entities.activities
  - state.entities.profiles[targetPid]

### DOMAIN
	- topic

### KEY
	- initList
	- initTopicModel
	- hots