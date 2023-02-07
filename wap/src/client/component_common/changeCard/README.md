# ChangeCard
## Usage
```javascript
<ChangeCard
  targetPid={ targetPid }
  connectionStatus={ 0 }
  reversible={ false }
  inNameCard={ false }
  primary={ false }
  normal={ true }
  line={ false }
  small={ false }
/>
```
## Props
- #### *targetPid: [Number]
> 要交換名片的對象之pid

- #### *connectionStatus: [Number]
> 目前雙方交友狀態 0=無、1=邀請中、2=待審核、3=朋友、4=封鎖

- #### reversible: [Bool] - Default: true
> 是否可收回交換名片

- #### inNameCard: [Bool] - Default: false
> 是否出現在nameCard( for GTM用的)

- #### primary: [Bool] - Default: true
> Button樣式

- #### normal: [Bool] - Default: false
> Button樣式

- #### line: [Bool] - Default: false
> Button樣式

- #### small: [Bool] - Default: false
> Button樣式
