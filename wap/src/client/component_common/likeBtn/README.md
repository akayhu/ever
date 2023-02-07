# LikeButton
## Usage
```javascript
import LikeButton from 'src/client/component_common/likeBtn';
<LikeButton
  itemData={ itemData }
  index={ index }
  clickTrigger={ this.showHint.bind(this) }
  styleName="like_btn"
/>
```
## Props
- #### itemData: [Object]
> must
> activity data

- #### index: [Number]
> must
> activity index

- #### clickTrigger [Function] - Dafault: 'Like action'
> option
> 有傳function進來會替換掉Like action
> example: 彈跳視窗Trigger.

- #### styleName
> option
> 把Style往下傳 
