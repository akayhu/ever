# CoolBtn
## Usage
```javascript
import {CoolBtn} from 'src/client/components/button';
<CoolBtn
  likeIt={ activity.likeIt }
	aidParent={ activity.aidParent }
	aid={ activity.aid }
/>
// or
<CoolBtn
	propsSource={ activity }
/>
```
## Props
- #### propsSource: [Object]
> `likeIt` `aidParent` `aid` 的檔案來源

- #### likeIt
> 是否已經按過酷
- #### aidParent
> 文章的aidParent
- #### aid
> 文章的aid

