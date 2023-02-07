# LazyLoading
## Usage

```javascript
import LazyLoading from 'src/util/lazyLoading';
<LazyLoading  loadingAct={ loading function }>
  { your data list }
</LazyLoading>
```

## Props
### body : [Boolean]
- optional
- default: true
- 取決於loading Action 的 Trigger 範圍為 document.body 還是 dataList 本身的區域

### reverseMode : [Boolean]
- optional
- default: false
- 取決於loading Action 的 Trigger 為上方還是下方

### loadingAct : [Function]
- Must have
- Set load more data function usually.
