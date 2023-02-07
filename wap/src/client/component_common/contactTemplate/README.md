# contactTemplate
## Usage
### 有共同好友及右側按鈕互動的
#### 拿來做:
1.  搜尋人的頁面
2.  職場動態人清單頁

![GITHUB](http://imgur.com/q1bbPnL.jpg "git圖示")

```javascript
<HaveCountTemplate
  pid={ 自己的pid },
  targetPid={ 對方的pid },
  avatarWebUrl={ 大頭貼 },
  userName={ 名字 },
  companyName={ 公司名 },
  jobTitle={ 工作頭銜 },
  count={ 共同好友數量 },
  major={ 主要的 }
  schoolName={ 校名 }
  keyword={ 搜尋關鍵字 給【搜尋使用】 }
  children={ 右邊的互動按鈕 自己餵 }
/>
```

***
## Usage
### 沒有共同好友及沒有右側按鈕互動的
#### 拿來做:
1.  點擊共同好友後lightbox顯示列表

![GITHUB](http://imgur.com/7MpdkQs.jpg "git圖示")

```javascript
<NoCountTemplate
  pid={ 自己的pid },
  avatarWebUrl={ 大頭貼 },
  name={ 名字 },
  companyName={ 公司名 },
  jobTitle={ 工作頭銜 },
  children={}
/>
```
