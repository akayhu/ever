# AdvanceDropDown
## Usage
```javascript
<AdvanceDropDown
  author={ this.props.isAuthor }
  itemData={ this.props.itemData }
  mode={ 'stream' }
  isAdmin={ false }
  handleEdit={ this.handleEdit }
  handleDeleteActivity={ this.handleDeleteActivity }
  handleSubscribe={ this.handleSubscribe }
  handleLightboxOpen={ this.handleLightboxOpen }
  handleIgnore={ this.handleIgnore }
  handleNotInterested={ this.handleNotInterested }
  handleAccuse={ this.handleAccuse }
/>
```
## Props
- #### *author: [Bool]
> 是否為作者

- #### *itemData: [Object]
> Activity的物件

- #### *mode: [String]
> 三種型態 stream, lightbox, singlePage

- #### isAdmin: [Bool] - Default: false
> 是否為社團管理者 (給社團使用的)

- #### handleEdit: [Function] - Default: null
> 編輯文章時觸發的函式

- #### handleDeleteActivity: [Function] - Default: null
> 刪除文章時觸發的函式，預設就會去觸發刪除文章的API

- #### handleSubscribe: [Function] - Default: null
> 編輯關注/取消關注時觸發的函式

- #### handleLightboxOpen: [Function] - Default: null
> 肯定這篇文章時觸發的函式

- #### handleIgnore: [Function] - Default: null
> 對文章沒興趣時觸發的函式

- #### handleNotInterested: [Function] - Default: null
> 對他的文章沒興趣時觸發的函式

- #### handleAccuse: [Function] - Default: null
> 檢舉這篇文章時觸發的函式

- #### handleRemove: [Function] - Default: null
> 將此篇文章移出社團(當isAdmin為true時，下拉列表才有這選項)
