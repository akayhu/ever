# SubscribeBtn
## Usage (關注按鈕)
```javascript
import {SubscribeBtn} from 'src/client/components/button/button';
<SubscribeBtn
  targetPid={ targetPid }
  subscribeStatus={ subscribeStatus }
  notificationStatus={ notificationStatus }
/>
```
## Props
- #### *targetPid: [String || Number]
> 對象之pid
- #### *subscribeStatus: [Bool]
> 關注中，或是尚未關注
- #### *notificationStatus: [Bool]
> 接受通知中，或是尚未接收通知

