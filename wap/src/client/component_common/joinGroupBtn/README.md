# JoinGroupBtn
## Usage
```javascript
<JoinGroupBtn
  simple
  buttonStyle="line"
  buttonSize="small"
  channelId={ channelId }
  isHead={ isHead }
  isMember={ isMember }
  isApplying={ isApplying }
  joinSetting={ joinSetting }
  noticeStatus={ noticeStatus }
/>
```
## Props
- #### simple: [Bool] - Default: false
> 按鈕類型(true為輕量型的，沒有下拉，主要給列表頁使用。false為完整型的，主要給子首頁使用)

- #### buttonStyle: [String] - Default: 'primary'
> 按鈕外觀樣式('primary', 'normal', 'line')

- #### buttonSize: [String] - Default: ''
> 按鈕大小樣式(目前只有'small')

- #### *channelId: [Number]
> 頻道/社團的id

- #### isHead: [Bool] - Default: false
> 是否為團長
> 若不是simple型態，為必傳項目!

- ### *isMember: [Bool] - Default: false
> 是否為成員

- ### *isApplying: [Bool] - Default: false
> 是否在申請中

- ### *joinSetting: [Number] - Default: 0
> 社團的加入設定(0: 不須審核, 1: 須審核)

- ### noticeStatus: [Bool] - Default: false
> 是否接收社團通知
> 若不是simple型態，為必傳項目!
