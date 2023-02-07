### Actions:
- initGroupPage - 進入公開社團時要觸發的action
- initMyGroupPage - 進入我的社團時要觸發的action
- initGroupMainPage - 進入社團首頁時觸發的action
- initGroupMemberPage - 進入社團首頁的成員列表時觸發的action
- changeGroupTab - 切換group的tab
- requestGroupData
- receiveGroupData
- receiveGroupDataFail

### 主要行為
```javascript
// 點選公開社團後，進去的頁面要先初始化
this.props.initGroupPage()

// 點選我的社團後，進去的頁面要先初始化
this.props.initMyGroupPage()

// 進入社團子首頁時的初始化
this.props.initGroupMainPage(channelId)

// 進入社團子首頁的成員列表時觸發的action
this.props.initGroupMainPage(channelId)
// 等同於
// this.props.initGroupMainPage(channelId)
//   .then(() => this.props.changeGroupTab('member', 'currentChannel', channelId))

// 切換group分頁
// subDomain: all, self, currentChannel
    // all: 公開社團 self: 我的社團  currentChannel: 社團子首頁
// tab: 知識技術...(中文開頭的分類), joined managed waitForJoin checking rejected, activity member
// 當tab為currentChannel時，需要帶入channelId (optional)
this.props.changeGroupTab(tab, subDomain, [channelId])

// 列表頁載入更多社團
import {loadListDataCenter} from 'src/client/actions/general';
// tab為現在分頁的名稱(公開社團:store.group.tab.all, 我的社團:store.group.tab.self)
this.props.loadListDataCenter({domain: 'group', key: tab});
```

### 相關STORE位置
  - state.group
  - state.entities.channels
  - state.entities.activities

### DOMAIN
	- group

### KEY
	- initGroupPage
  - initMyGroupPage
  - initSingleGroup
  - joined
  - waitForJoin
  - checking
  - rejected
  - managed
  - 知識技術
  - ...其他中文社團類別
  - activity
  - member