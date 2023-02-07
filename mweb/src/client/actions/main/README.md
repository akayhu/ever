### ACTIONS
  - initMainPage - 進入首頁時初始化用
  - changeMainTab - 切換到其他分頁用(hot, latest, all)
  
### 主要行為
  ```javascript
  // 進入首頁時的初始化
  this.props.initMainPage()

  // 切換分頁
  this.props.changeMainTab(tab)

  // 要載入分頁更多文章時使用
  this.props.loadListDataCenter({domain: 'main', key: 'latest'})
  ```

### 相關STORE位置
  - state.main
  - state.entities.activities

### DOMAIN: 
  - main
### KEY: 
  - hot
  - latest
  - all