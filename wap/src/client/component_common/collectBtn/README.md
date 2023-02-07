# CollectButton
## Usage
```javascript
import LikeButton from 'src/client/component_common/likeBtn';
<CollectButton
  itemData={ itemData }
  index={ index }
  clickTrigger={ this.showHint.bind(this) }
  styleName="collect_icon"
/>
```
## Props
- #### itemData: [Object]
> must
> activity data

- #### index: [Number]
> must
> activity index

- #### clickTrigger [Function] - Dafault: 'Collect action'
> option
> 有傳function進來會替換掉Collect action
> example: 彈跳視窗Trigger.

- #### styleName [String]
> option
> 把style往下傳
