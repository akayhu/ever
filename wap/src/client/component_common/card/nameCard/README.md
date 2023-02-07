# NameCard
## Usage
```javascript
<NameCard
  targetPid={ targetPid }
  href={ profileUrl }
  imgSrc={ avatarSrc }
  name={ userName }
  gtm={ gtmTag }
  textMode={ false }
  avatarSize={ 75 }
/>
```
## Props
- #### *targetPid: [String]
> 小名片對象的pid

- #### *href: [String]
> 小名片對象的profile頁網址

- #### imgSrc: [String] - Default: ''
> 小名片對象的avatar圖檔位置

- #### name: [String] - Default: ''
> 小名片對象的名字

- #### gtm: [Object] - Default: null
> gtm的tag物件

- #### textMode: [Boll] - Default: false
> hover的target是否為文字(姓名)

- #### avatarSize: [Number] - Default: 40
> 小名片頭像尺寸
