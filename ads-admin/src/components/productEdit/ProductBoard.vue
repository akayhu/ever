<template>
  <div>
    <div v-if="edit" class="loading_block">
      <Loading />
    </div>

    <div v-if="!edit">
      <div class="product_content">
        <div>載具<span class="necessary">*</span></div>
        <div>
          <el-select
            data-e2e="device"
            popperClass="device"
            v-model="device"
            @change="handleSearchDevice"
            @focus="selectFocus"
            placeholder="請選擇"
            :class="{
              error_message_border:
                v.$error && v.$each.$response.$data[index].device.$error,
              error_message_width:
                v.$error && v.$each.$response.$data[index].device.$error
            }"
          >
            <el-option label="PC" value="PC"></el-option>
            <el-option label="APP" value="APP"></el-option>
            <el-option label="Mobile" value="MOBILE"></el-option>
          </el-select>
          <div class="product-error">
            <ValidationError
              v-if="v.$error && v.$each.$response.$data[index].device.$error"
              :vData="v.$each.$response.$data[index].device"
              text="請選擇載具"
            />
          </div>
        </div>
        <div>網站<span class="necessary">*</span></div>
        <div>
          <SelectDropdown
            data-e2e="site"
            popperClass="site"
            @value-changed="setSelectedSite($event)"
            :value="siteData.siteName"
            :options="siteData.searchedSiteOptions"
            :filterable="true"
            :optionsAllData="true"
            :placeholder="
              siteData.searchedSiteOptions.length < 1
                ? '請先選擇載具---'
                : '請選擇----'
            "
            :handleFocus="selectFocus"
            :class="{
              error_message_border:
                v.$error && v.$each.$response.$data[index].siteId.$error,
              error_message_width:
                v.$error && v.$each.$response.$data[index].device.$error
            }"
          />
          <div class="product-error">
            <ValidationError
              v-if="v.$error && v.$each.$response.$data[index].siteId.$error"
              :vData="v.$each.$response.$data[index].siteId"
              text="請選擇網站"
            />
          </div>
        </div>
      </div>

      <div class="product_content">
        <div>頻道<span class="necessary">*</span></div>
        <div>
          <SelectDropdown
            data-e2e="channel"
            popperClass="channel"
            @value-changed="setSelectedChannel($event)"
            :value="channelData.channelName"
            :options="channelData.searchedChannelOptions"
            :filterable="true"
            :optionsAllData="true"
            :placeholder="
              channelData.searchedChannelOptions.length < 1
                ? '請先選擇網站---'
                : '請選擇----'
            "
            :handleFocus="selectFocus"
            :class="{
              error_message_border:
                v.$error && v.$each.$response.$data[index].channelId.$error,
              error_message_width:
                v.$error && v.$each.$response.$data[index].device.$error
            }"
          />
          <div class="product-error">
            <ValidationError
              v-if="v.$error && v.$each.$response.$data[index].channelId.$error"
              :vData="v.$each.$response.$data[index].channelId"
              text="請選擇頻道"
            />
          </div>
        </div>
        <div>版位<span class="necessary">*</span></div>
        <div>
          <SelectDropdown
            data-e2e="board"
            popperClass="board"
            @value-changed="setSelectedBoard($event)"
            :value="boardData.boardName"
            :options="boardData.searchedBoardOptions"
            :filterable="true"
            :optionsAllData="true"
            :placeholder="
              boardData.searchedBoardOptions.length < 1
                ? '請先選擇頻道---'
                : '請選擇----'
            "
            :handleFocus="selectFocus"
            :class="{
              error_message_border:
                v.$error && v.$each.$response.$data[index].boardId.$error,
              error_message_width:
                v.$error && v.$each.$response.$data[index].device.$error
            }"
          />
          <div class="product-error">
            <ValidationError
              v-if="v.$error && v.$each.$response.$data[index].boardId.$error"
              :vData="v.$each.$response.$data[index].boardId"
              text="請選擇版位"
            />
          </div>
        </div>
        <div>預約數<span class="necessary">*</span></div>
        <div>
          <input
            v-model="productQuantity"
            type="text"
            widthType="122"
            placeholder="請輸入"
            :class="{
              error_message_border:
                v.$error && v.$each.$response.$data[index].quantity.$error
            }"
          />
          <div class="product-error">
            <ValidationError
              v-if="v.$error && v.$each.$response.$data[index].quantity.$error"
              :vData="v.$each.$response.$data[index].quantity"
              text="請輸入預約數"
            />
          </div>
        </div>
        <div>
          <span>主版位</span>
          <input
            type="checkbox"
            value="1"
            v-model="productSort"
            :id="`sort_${item.id}`"
            :disabled="disabled"
          />
          <label :for="`sort_${item.id}`"><span></span></label>
          <div class="product-error">
            <ValidationError
              v-if="v.$error && v.$each.$response.$data[index].sortValue.$error"
              :vData="v.$each.$response.$data[index].sortValue"
              text="請勾選主版位"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="bindingProducts.length > 0 && !edit" class="binding_product">
      <div class="title">
        <div class="dotted"></div>
        已綁定商品
      </div>
      <div class="content_block">
        <div
          v-for="(product, index) in bindingProducts"
          :key="product.id"
          class="list"
        >
          {{ `${index + 1}. ${product.name}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SelectDropdown from "@/components/SelectDropdown.vue";
import ValidationError from "@/components/ValidationError.vue";
import Loading from "@/components/Loading.vue";
import { EventBus } from "@/utils/eventBus.js";
import { useSiteStore } from "@/storesPinia/site.js";
import { useChannelStore } from "@/storesPinia/channel.js";
import { useBoardStore } from "@/storesPinia/board.js";
import { useProductStore } from "@/storesPinia/product.js";

const props = defineProps({
  index: {
    type: Number
  },
  item: {
    type: Object,
    required: true
  },
  v: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  productCode: {
    type: String
  }
});
const emit = defineEmits(["changeBoardsData", "changeSort", "changeQuantity"]);
const siteStore = useSiteStore();
const channelStore = useChannelStore();
const boardStore = useBoardStore();
const productStore = useProductStore();
const { getSiteMenu } = siteStore;
const { getChannelMenu } = channelStore;
const { getBoardMenu } = boardStore;
const { getProductBoard } = productStore;
const siteData = ref({
  siteName: "",
  siteId: "",
  searchedSiteOptions: []
});
const channelData = ref({
  channelName: "",
  channelId: "",
  searchedChannelOptions: []
});
const boardData = ref({
  boardName: "",
  boardId: "",
  searchedBoardOptions: []
});
const device = ref("");
const edit = ref(false);
const productSort = computed({
  get: () => props.item.sortValue,
  set: value => {
    emit("changeSort", props.index, value);
  }
});
const productQuantity = computed({
  get: () => props.item.quantity,
  set: value => {
    emit("changeQuantity", props.index, value);
  }
});
const bindingProducts = ref([]);

// 編輯初始化
const init = data => {
  edit.value = data.edit;

  // 編輯時，預設帶入選取載具
  if (data.device) {
    device.value = data.device;

    // 預設帶入選取網站與頻道 menu 資訊
    if (data.siteId) {
      getSiteMenuFunc(data.siteId);
      getChannelMenuFunc(data.siteId);

      // 一開始就有頻道 id，預設帶入選取版位 menu 資訊
      if (data.channelId) getBoardMenuFunc(data.siteId, data.channelId);
      if (data.boardId) getBoardProductFunc(data.boardId);
    }
  }
};

// 清空所有資料
const resetAllData = () => {
  resetSiteData();
  resetChannelData();
  resetBoardData();
  resetBindingProductData();
};

// 清空網站下拉資料
const resetSiteData = () => {
  siteData.value.siteName = "";
  siteData.value.siteId = "";
  siteData.value.searchedSiteOptions = [];
};

// 清空頻道下拉資料
const resetChannelData = () => {
  channelData.value.channelName = "";
  channelData.value.channelId = "";
  channelData.value.searchedChannelOptions = [];
};

// 清空版位下拉資料
const resetBoardData = () => {
  boardData.value.boardName = "";
  boardData.value.boardId = "";
  boardData.value.searchedBoardOptions = [];
};

// 清空版位綁定商品資訊
const resetBindingProductData = () => {
  bindingProducts.value = [];
};

// 網站 Autocomplete
const setSelectedSite = data => {
  if (!!data) {
    siteData.value.siteName = siteData.value.searchedSiteOptions.find(
      option => option.name === data.name
    ).name;
    siteData.value.siteId = siteData.value.searchedSiteOptions.find(
      option => option.name === data.name
    ).id;
    emit("changeBoardsData", props.index, siteData.value.siteId, "siteId");
    resetChannelData();
    resetBoardData();
    resetBindingProductData();
    getChannelMenuFunc(siteData.value.siteId);
  }
};

// 頻道 Autocomplete
const setSelectedChannel = data => {
  if (!!data) {
    channelData.value.channelName =
      channelData.value.searchedChannelOptions.find(
        option => option.name === data.name
      ).name;
    channelData.value.channelId = channelData.value.searchedChannelOptions.find(
      option => option.name === data.name
    ).id;
    emit(
      "changeBoardsData",
      props.index,
      channelData.value.channelId,
      "channelId"
    );
    resetBoardData();
    resetBindingProductData();
    getBoardMenuFunc(siteData.value.siteId, channelData.value.channelId);
  }
};

// 版位 Autocomplete
const setSelectedBoard = data => {
  if (!!data) {
    boardData.value.boardName = boardData.value.searchedBoardOptions.find(
      option => option.name === data.name
    ).name;
    boardData.value.boardId = boardData.value.searchedBoardOptions.find(
      option => option.name === data.name
    ).id;
    getBoardProductFunc(boardData.value.boardId);
    emit("changeBoardsData", props.index, boardData.value.boardId, "boardId");
  }
};

// 選擇載具
const handleSearchDevice = value => {
  emit("changeBoardsData", props.index, value, "device");
  resetAllData();
  getSiteMenuFunc();
};

// 取網站 menu 函式
const getSiteMenuFunc = siteId => {
  const siteMenuQuery = {
    page: 1,
    size: 100,
    status: true,
    device: device.value
  };
  channelData.value.searchedChannelOptions = [];
  getSiteMenu(siteMenuQuery).then(siteItem => {
    siteData.value.searchedSiteOptions = siteItem.content.map(item => {
      return {
        ...item,
        value: item.id,
        label: item.name
      };
    });
    // 編輯時，預設帶入選取網站 menu 資訊
    if (siteId) {
      siteItem.content.forEach(menuItem => {
        if (menuItem.id === props.item.siteId) {
          siteData.value.siteName = menuItem.name;
          siteData.value.siteId = menuItem.id;
        }
      });
    }
  });
};

// 取頻道 menu 函式
const getChannelMenuFunc = siteId => {
  boardData.value.searchedBoardOptions = [];
  getChannelMenu({ siteId, status: true }).then(channelItem => {
    channelData.value.searchedChannelOptions = channelItem.map(item => {
      return {
        ...item,
        value: item.id,
        label: item.name
      };
    });
    // 編輯時，帶入選取頻道 menu 值
    if (props.item.channelId) {
      channelItem.forEach(menuItem => {
        if (menuItem.id === props.item.channelId) {
          channelData.value.channelName = menuItem.name;
          channelData.value.channelId = menuItem.id;
        }
      });
    }
  });
};

// 取版位 menu 函式
const getBoardMenuFunc = (siteId, channelId) => {
  getBoardMenu({
    siteId,
    channelId,
    status: true
  }).then(boardItem => {
    edit.value = false;
    boardData.value.searchedBoardOptions = boardItem.map(item => {
      return {
        ...item,
        value: item.id,
        label: item.name
      };
    });
    // 編輯時，帶入選取版位 menu 值
    if (props.item.boardId) {
      boardItem.forEach(menuItem => {
        if (menuItem.id === props.item.boardId) {
          boardData.value.boardName = menuItem.name;
          boardData.value.boardId = menuItem.id;
        }
      });
    }
  });
};

// 取版位綁定商品
const getBoardProductFunc = boardId => {
  getProductBoard({
    boardId
  }).then(products => {
    bindingProducts.value = products.filter(
      product => product.productCode != props.productCode
    );
  });
};

const selectFocus = () => {
  props.v.$reset();
};

init(props.item);

EventBus.on("resetProductBoardData", () => {
  device.value = "";
  resetAllData();
});
</script>

<style lang="scss" scoped>
.loading_block {
  text-align: center;
}

.product_content {
  display: flex;
  align-items: baseline;
  margin-bottom: 24px;

  > div {
    margin-right: 28px;

    &:nth-child(2),
    &:nth-child(4) {
      :deep(input) {
        width: 260px;
      }
    }
    &:nth-child(7) {
      span {
        margin-right: 10px;
      }
    }
  }
}

.error_message_width {
  width: 260px;
}

.binding_product {
  .title {
    display: flex;
    align-items: baseline;
    font-weight: bold;

    .dotted {
      border-bottom: 1px dashed #d6d6d6;
      border-left: 1px dashed #d6d6d6;
      width: 24px;
      height: 24px;
      margin-left: 24px;
      margin-right: 16px;
      transform: translateY(-5px);
    }
  }

  .content_block {
    width: 1080px;
    margin-top: 16px;
    margin-left: 60px;
    padding: 19px 13px;
    background-color: #e6f9fa;

    .list:not(:last-child) {
      margin-bottom: 26px;
    }
  }
}
</style>
