# Image
## Usage
```javascript
<Image
  src={ imgSrc }
  type={ imgType }
  domain={ imgDomain }
  errorImg={ errorSrc }
/>
```
## Props
- #### src: [String]
> 圖片來源，若沒船入會載入錯誤圖片

- #### type: [String] - Default:　'avatar'
> 圖片類型(目前預設'avatar',若沒有errorImg則發生載入錯誤時會以預設大頭貼取代)

- #### domain: [String] - Default: 'profile'
> 圖片出現場域('profile', 'channel', 'cover')，當發生錯誤時會根據type和domain載入預設圖片

- #### errorImg: [String] - Default:　''
> 發生載入錯誤時所要載入的預設圖片
