<template>
  <section>
    <h2>權限查詢表</h2>

    <table cellspacing="0" cellpadding="0">
      <tr>
        <th rowspan="2" class="br-solod bb-solod"></th>
        <th rowspan="2" colspan="2" class="br-solod bb-solod">功能</th>
        <th rowspan="2" class="br-solod bb-solod">模式</th>
        <th rowspan="2" class="bb-solod">PM</th>
        <th rowspan="2" class="bb-solod">VM</th>
        <th rowspan="2" class="br-solod bb-solod">主管</th>
        <th colspan="4" class="bb-solod">整招</th>
      </tr>
      <tr>
        <th class="bb-solod">業務</th>
        <th class="bb-solod">企劃</th>
        <th class="bb-solod">營運</th>
        <th class="bb-solod">主管</th>
      </tr>

      <!-- 後台 網站管理(含APP) View -->
      <tr class="backstage">
        <td rowspan="9" class="br-solod bb-solod">後台</td>
        <td rowspan="9" class="br-solod bb-solod">廣告元件管理</td>
        <td rowspan="2" class="br-solod bb-solod-faint-line">
          網站管理(含APP)
        </td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!-- 網站管理(含APP) Edit -->
      <tr class="backstage_edit">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!-- 頻道管理 View -->
      <tr class="backstage_other_management">
        <td rowspan="2" class="br-solod bb-solod-faint-line">頻道管理</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!-- 頻道管理 Edit -->
      <tr class="backstage_other_management_edit">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!--  版位管理 View -->
      <tr class="backstage_other_management">
        <td rowspan="2" class="br-solod bb-solod-faint-line">版位管理</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!-- 版位管理 Edit -->
      <tr class="backstage_other_management_edit">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!--  商品與版位關聯管理 View -->
      <tr class="backstage_other_management">
        <td rowspan="2" class="br-solod bb-solod-faint-line">
          商品與版位關聯管理
        </td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!-- 商品與版位關聯管理 Edit -->
      <tr class="backstage_other_management_edit">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!-- 墊檔廣告上傳 link -->
      <tr class="backstage_other_management">
        <td class="br-solod bb-solod">墊檔廣告上傳</td>
        <td class="br-solod bb-solod">Link</td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod"></td>
        <td class="br-solod-faint-line bb-solod"></td>
        <td class="br-solod-faint-line bb-solod"></td>
        <td class="bb-solod"></td>
      </tr>

      <!-- 前台 檔期行事曆 View -->
      <tr class="front_desk img-mb-4">
        <td rowspan="14" class="br-solod bb-solod">前台</td>
        <td rowspan="4" class="br-solod bb-solod">檔期預約管理</td>
        <td rowspan="2" class="br-solod bb-solod-faint-line">檔期行事曆</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*4
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*4
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />*4
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*4<br />*銷售
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*4<br />*銷售
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*4<br />*銷售
        </td>
        <td class="bb-solod-faint-line">
          <icon iconName="icon-line-on" />*4<br />*銷售
        </td>
      </tr>

      <!-- 檔期行事曆 Edit -->
      <tr class="front_desk_other_edit img-mb-4">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3<br />*行銷
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*2<br />*行銷
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3 *4<br />*行銷
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*2<br />*銷售
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3 *4<br />*銷售
        </td>
        <td class="bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3<br />*銷售
        </td>
      </tr>

      <!-- 專案及版位維護 View -->
      <tr class="front_desk_other">
        <td rowspan="2" class="br-solod bb-solod">專案及版位維護</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="bb-solod-faint-line"><icon iconName="icon-line-on" /></td>
      </tr>

      <!-- 專案及版位維護 Edit -->
      <tr class="front_desk_other_edit img-mb-4">
        <td class="br-solod bb-solod">Edit</td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />*3<br />*行銷
        </td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />*2<br />*行銷
        </td>
        <td class="br-solod bb-solod">
          <icon iconName="icon-line-on" />*3 *4<br />*行銷
        </td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />*2<br />*銷售
        </td>
        <td class="br-solod-faint-line bb-solod"></td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />*3 *4<br />*銷售
        </td>
        <td class="bb-solod"><icon iconName="icon-line-on" />*3<br />*銷售</td>
      </tr>

      <!-- 上傳素材 View -->
      <tr class="front_desk_management">
        <td rowspan="6" class="br-solod bb-solod">廣告上刊管理</td>
        <td rowspan="2" class="br-solod bb-solod-faint-line">上傳素材</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="bb-solod-faint-line"><icon iconName="icon-line-on" /></td>
      </tr>

      <!-- 上傳素材 Edit -->
      <tr class="front_desk_other_edit img-mb-4">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3<br />*行銷
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*2<br />*銷售
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3
        </td>
        <td class="bb-solod-faint-line"><icon iconName="icon-line-on" />*3</td>
      </tr>

      <!-- 緊急上下架 View -->
      <tr class="front_desk_other">
        <td rowspan="2" class="br-solod bb-solod-faint-line">緊急上下架</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="bb-solod-faint-line"><icon iconName="icon-line-on" /></td>
      </tr>

      <!-- 緊急上下架 Edit -->
      <tr class="front_desk_other_edit">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="bb-solod-faint-line"><icon iconName="icon-line-on" /></td>
      </tr>

      <!-- 墊檔廣告維護 View -->
      <tr class="front_desk_other">
        <td rowspan="2" class="br-solod bb-solod">墊檔廣告維護</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="br-solod-faint-line bb-solod-faint-line"></td>
        <td class="bb-solod-faint-line"></td>
      </tr>

      <!-- 墊檔廣告維護 Edit -->
      <tr class="front_desk_other_edit">
        <td class="br-solod bb-solod">Edit</td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod"><icon iconName="icon-line-on" /></td>
        <td class="br-solod-faint-line bb-solod"></td>
        <td class="br-solod-faint-line bb-solod"></td>
        <td class="br-solod-faint-line bb-solod"></td>
        <td class="bb-solod"></td>
      </tr>

      <!-- 企業資料維護 View -->
      <tr class="front_desk_management">
        <td rowspan="4" class="br-solod bb-solod">報表查詢</td>
        <td rowspan="2" class="br-solod bb-solod-faint-line">企業資料維護</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="bb-solod-faint-line"><icon iconName="icon-line-on" /></td>
      </tr>

      <!-- 企業資料維護 Edit -->
      <tr class="front_desk_other_edit img-mb-4">
        <td class="br-solod bb-solod-faint-line">Edit</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*2
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*2
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />*2
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*2
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />*3
        </td>
        <td class="bb-solod-faint-line"><icon iconName="icon-line-on" />*3</td>
      </tr>

      <!-- 企業結案報告 View -->
      <tr class="front_desk_other">
        <td class="br-solod bb-solod-faint-line">企業結案報告</td>
        <td class="br-solod bb-solod-faint-line">View</td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod-faint-line">
          <icon iconName="icon-line-on" />
        </td>
      </tr>

      <!-- 成效排行榜 View -->
      <tr class="front_desk_other">
        <td class="br-solod bb-solod">成效排行榜</td>
        <td class="br-solod bb-solod">View</td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod bb-solod"><icon iconName="icon-line-on" /></td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="br-solod-faint-line bb-solod">
          <icon iconName="icon-line-on" />
        </td>
        <td class="bb-solod"><icon iconName="icon-line-on" /></td>
      </tr>

      <tr class="hint">
        <td class="br-solod">提示<br />說明</td>
        <td colspan="10">
          <ul>
            <li>*行銷：只能修改、新增、刪除行銷版位</li>
            <li>*銷售：只能修改、新增、刪除銷售版位</li>
            <li>*2：只能編輯自己的</li>
            <li>*3：可以編輯自己跟其他人的</li>
            <li>*4：特殊權限，說明如下</li>
            <li>
              4.1 檔期行事曆：可看到「已拉cue」、「已上素材」、「已上線」的狀態
            </li>
            <li>4.2 可修改專案預約人員</li>
            <li>4.3 可設定專案是否為空版專案</li>
            <li>
              4.4 可更改專案狀態從「結案->合約簽回」或「合約簽回->提案中」
            </li>
          </ul>
        </td>
      </tr>
    </table>
  </section>
</template>

<style lang="scss" scoped>
section {
  width: 958px;
  margin: 20px auto 50px;
  background-color: #fff;
  padding: 30px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;

  h2 {
    margin: 0 0 20px 64px;
  }

  table {
    border: 1px solid #a9a9a9;
    width: 830px;
    margin: 0 auto;

    tr {
      th,
      td {
        vertical-align: middle;
        text-align: center;
        font-size: 14px;
        letter-spacing: 1.5px;
        padding: 8px 0;
      }

      th {
        background-color: #f0f0f0;

        &:nth-child(1) {
          width: 48px;
        }
      }

      td {
        img {
          width: 20px !important;
          display: block;
          margin: 0 auto;
        }
      }

      &:nth-child(1) {
        th {
          &:nth-child(2) {
            width: 133px;
          }
          &:nth-child(3) {
            width: 63px;
          }
          &:nth-child(4),
          &:nth-child(5) {
            width: 60px;
          }
          &:nth-child(6) {
            width: 58px;
          }
          &:nth-child(7) {
            width: 242px;
          }
        }
      }

      &:nth-child(2) {
        th {
          width: 46px;
        }
      }

      &.backstage {
        td {
          &:nth-child(1) {
            font-weight: bold;
            background-color: #b2ffde;
          }
          &:nth-child(2) {
            background-color: #ccffe9;
          }
          &:nth-child(3) {
            background-color: #e4fff3;
            text-align: left;
            padding-left: 12px;
          }
          &:nth-child(4) {
            background-color: #f3fffa;
          }
        }
      }

      &.backstage_edit {
        td {
          &:nth-child(1) {
            text-align: left;
            padding-left: 12px;
            background-color: #f3fffa;
          }
        }
      }

      &.backstage_other_management {
        td {
          &:nth-child(1) {
            background-color: #e4fff3;
            text-align: left;
            padding-left: 12px;
          }
          &:nth-child(2) {
            text-align: left;
            padding-left: 12px;
            background-color: #f3fffa;
          }
        }
      }

      &.backstage_other_management_edit {
        td {
          &:nth-child(1) {
            text-align: left;
            padding-left: 12px;
            background-color: #f3fffa;
          }
        }
      }

      &.front_desk {
        td {
          vertical-align: top;

          &:nth-child(1) {
            vertical-align: middle;
            background-color: #bef3f6;
            font-weight: bold;
          }
          &:nth-child(2) {
            vertical-align: middle;
            background-color: #e0fcfd;
            text-align: left;
            padding-left: 12px;
          }
          &:nth-child(3) {
            vertical-align: middle;
            background-color: #f2fdfe;
            text-align: left;
            padding-left: 12px;
          }
          &:nth-child(4) {
            vertical-align: middle;
            background-color: #f9feff;
            text-align: left;
            padding-left: 12px;
          }
        }
      }

      &.front_desk_management {
        td {
          vertical-align: top;

          &:nth-child(1) {
            vertical-align: middle;
            background-color: #e0fcfd;
            text-align: left;
            padding-left: 12px;
          }
          &:nth-child(2) {
            vertical-align: middle;
            background-color: #f2fdfe;
            text-align: left;
            padding-left: 12px;
          }
          &:nth-child(3) {
            vertical-align: middle;
            background-color: #f9feff;
            text-align: left;
            padding-left: 12px;
          }
        }
      }

      &.front_desk_other {
        td {
          vertical-align: top;

          &:nth-child(1) {
            vertical-align: middle;
            background-color: #f2fdfe;
            text-align: left;
            padding-left: 12px;
          }
          &:nth-child(2) {
            vertical-align: middle;
            background-color: #f9feff;
            text-align: left;
            padding-left: 12px;
          }
        }
      }

      &.front_desk_other_edit {
        td {
          vertical-align: top;

          &:nth-child(1) {
            vertical-align: middle;
            background-color: #f9feff;
            text-align: left;
            padding-left: 12px;
          }
        }
      }

      &.hint {
        td {
          &:nth-child(1) {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          &:nth-child(2) {
            text-align: left;
            padding-left: 12px;
            background-color: #fafafa;

            ul {
              margin-bottom: 0;
            }
          }
        }
      }

      &.img-mb-4 {
        td {
          img {
            margin-bottom: 4px;
          }
        }
      }
    }
  }

  .br-solod {
    border-right: 1px solid #a9a9a9;
  }

  .bb-solod {
    border-bottom: 1px solid #a9a9a9;
  }

  .br-solod-faint-line {
    border-right: 1px solid #e2e1e1;
  }

  .bb-solod-faint-line {
    border-bottom: 1px solid #e2e1e1;
  }
}
</style>
