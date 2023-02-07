# plus_rest

Merge all rest from wap and global to here


## Unit Test

```
// 執行測試
npm run test
// 測試並產生覆蓋率文件
npm run test:coverage
```

測試文件請放置於要測試的 js 對象的同一層目錄 `__tests__` 中，檔名規則為 `{測試文件名}.spec.js`

```
.
├── src
│   └── server
│        └── utils
│             ├── __tests__
│             │    └── IpUtil.spec.js
│             └── IpUtil.js
└── node_modules
```

當需要 mocks 資料時請寫入在緊鄰對象 module 的目錄 `__mocks__` 中，命名保持一至，假如 mock 對象於 node_modules 中則放於相鄰的 `__mocks__` 中

```
.
├── src
│   ├── __mocks__
│   │   └── user.js
│   └── user.js
├── node_modules
│       └──  fs 
└── __mocks__
        └── fs.js
```