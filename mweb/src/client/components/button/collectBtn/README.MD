# CollectBtn
## Usage
```javascript
import {CollectBtn} from 'src/client/components/button';
<CollectBtn
  collectIt={ activity.collectIt }
	aid={ activity.aid }
/>
// or
<CollectBtn
	propsSource={ activity }
/>
```
## Props
- #### propsSource: [Object]
> `collectIt` `aid` 的檔案來源
- #### collectIt
> 是否已經收藏
- #### aid
> 文章的aid

