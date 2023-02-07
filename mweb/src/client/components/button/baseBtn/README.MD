# CollectBtn
## Usage (主要用在CollectBtn 和 CoolBtn)
```javascript
import BaseBtn from 'src/client/components/button/baseBtn';
<BaseBtn
	checked={ checked }
	clickHandler={ triggerClick }
	params={ params }
>
	{你的button icon}
</BaseBtn>
```
## Props
- #### *checked: [Bool]
> 是否按過了
- #### *clickHandler: [Function]
> 按下按鈕要觸發的行為
- #### params
> clickHandler執行時所要傳入的參數

