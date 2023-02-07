# Notice
## Usage
```javascript
import Notice from 'src/client/component_common/notice';

closeNotice() {
  this.setState({showNotice: false});
}

{
this.state.showNotice &&
<Notice
  content="**全球最大的崩潰社群中心上線啦**"
  style = "alert"
  close = {this.closeNotice.bind(this)}
  timeout="500"
/>
}
```
## Props

- #### content: [String] 
> 塞入字串 

- #### style: [String]  
> "alert" or empty

- #### closeFunction: [Function]  
> 請把notice unmount, component不建議自己unmount自己

- #### timeout: [integer]  
> in ms default 5000ms
