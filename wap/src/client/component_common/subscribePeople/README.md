# SubscribePeople
## Usage
```javascript
<SubscribePeople
  targetPid={ targetPid }
  subscribeStatus={ false }
  notificationStatus
  fullModeButton={false}
  alwaysShow
  reversible
  primary={ false }
  normal={ true }
  line={ false }
  small={ false }
/>
```
## Props
- #### *targetPid: [Number]
> 要關注的對象之pid

- #### *subscribeStatus: [Bool]
> 是否已關注

- #### *notificationStatus: [Bool]
> 是否已接受通知(for 下拉按鈕)

- #### fullModeButton: [Bool] - Default: true
> DropDownMenu形式的按鈕型態

- #### alwaysShow: [Bool] - Default: true
> 若是已關注是否呈現以關注按鈕

- #### reversible: [Bool] - Default: true
> 呈現的已關注按鈕，是否有取消關注的功能。若無則是純文字


- #### primary: [Bool] - Default: true
> Button樣式

- #### normal: [Bool] - Default: false
> Button樣式

- #### line: [Bool] - Default: false
> Button樣式

- #### small: [Bool] - Default: false
> Button樣式
