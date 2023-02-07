### Actions:
 - initProfilePage - 進入profile頁時初始化用
 - changeProfilePage - 切換profile頁面用的
 - getViewAs - 取得viewAs
 - initLoadProcess - 取得 profile 的區塊資料(guest, event, gallery, appraise, endorse, colleague)

### 主要行為
  ```javascript
  // profile頁面初始化
  this.props.initProfilePage(targetPid)
  
  // 切換profile頁面用(tab = 'info' or 'activity')
  this.props.changeProfilePage({tab: 'activity', targetPid});
  
  // 取得viewAs state.profile
  this.props.getViewAs(targetPid);
  
  // 要載入更多activity, gallery, appraise, endorse, colleague
  this.props.loadListDataCenter({domain: 'profile', key: '...', targetPid})
  ```

### 相關STORE位置
  - state.profile
  - state.entities.activities
  - state.entities.profiles[targetPid]

### DOMAIN:
  - profile
### KEY:
  - init
  - info
  - activity
  - gallery 
  - appraise 
  - endorse 
  - colleague 
  - guest
  - event
