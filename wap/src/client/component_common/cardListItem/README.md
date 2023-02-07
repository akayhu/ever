# CardListItem
## Usage
```javascript
<CardListItem
  id={ channelId }
  domain={ 'channel' }
  cover={ coverWebUrl }
  title={ channelName }
  description={ channelDes }
  statCount={ subscribeCount }
  avatarList={ subscribeList }
  subCategory={ category }
  tagList={ tagList }
>
  <SomeButton {...} />
</CardListItem>
```
## Props
- #### *id: [Number or String]
> 社團或頻道的id，用來連結到其子首頁

- #### *domain: [String]
> 判斷此item是社團或是頻道('channel' or 'group')

- #### *title: [String]
> 社團/頻道的名稱

- #### *description: [String]
> 社團/頻道的簡介

- #### *statCount: [Number]
> 顯示統計資訊(頻道:加入頻道人數、社團:文章數)

- #### avatarList: [[{..., pid, avatarWebUrl, userName}]] - Default: []
> 用來呈現小名片用，陣列內的物件必須要有此三項(pid, avatarWebUrl, userName)

- #### subCategory: [String] - Default: ''
> 社團類別

- #### tagList: [[String]] - Default: []
> 用來顯示tag(社團用)

- #### cover: [String] - Deafult: ''
> item的風景照
