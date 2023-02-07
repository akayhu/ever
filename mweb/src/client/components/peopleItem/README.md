# PeopleItem
## Usage
```javascript
import PeopleItem from 'src/client/components/peopleItem';
<PeopleItem
  userObj={ userObj }
  otherObj={ otherObj }
/>
```
## Props
- #### *userObj: [Object]
> 存放user的資訊，物件內必須包含 `{pid, userName, ...}`<br/>
學歷或工作資訊非必要<br/>
最完整狀況會長這樣 `{pid, userName, companyName, jobTitle, schoolName, major}`

- #### otherObj: [Object] - Default: null
> 存放其他資訊。若有傳入`otherObj`，其資訊會顯示在user名稱右邊<br/>
  `otherObj`內須包含，name與link `{name, link, ...}`<br/>
  `name`為顯示的名稱，`link`為點選後會連到的位置

- #### imgSize: [Number] - Default: 40
> 大頭照的大小

- #### imgStyle: [Object]
> 大頭照的style

- #### onlyImg: [Bool]
> 只有大頭貼是否

- #### wrapStyle: [Object]
> 最外層的style
