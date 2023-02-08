<template>
  <div class="pt-6" :class="{ checked_block: prepareProjService.checked }">
    <div class="item_block">
      <div class="left_content">
        <input
          type="checkbox"
          id="pull_cue_item"
          v-model="prepareProjService.checked"
          @change="setOherAd"
        />
        <label for="pull_cue_item" class="mr-2">
          <span class="mr-2"></span>{{ prepareProjService.startDate }} ~
          {{ prepareProjService.endDate }}
        </label>
        <span class="ml-7 mr-7">數量</span>
        <input
          type="text"
          v-model="prepareProjService.quantity"
          widthType="52"
          class="mr-9"
        />
        <input
          type="checkbox"
          v-model="prepareProjService.free"
          :id="`item_giveAway`"
          @change="setFree"
        />
        <label :for="`item_giveAway`" class="item_giveAway">
          <span></span>
          贈送
        </label>
      </div>
      <div>
        <span class="mr-7">小計(含税)</span>
        <input
          ref="priceIncludeTaxRef"
          v-model="prepareProjService.priceIncludeTax"
          type="text"
          widthType="96"
          @blur="getPullCue"
          @keyup.enter="getPullCue"
        />
        <span class="unit">元</span>
      </div>
    </div>

    <!-- 勾選後長出的區塊 -->
    <div v-if="prepareProjService.checked" class="item_open_block">
      <div class="open_content mb-3">
        <div>
          <span class="left_title">牌價(含税)</span>
          <span class="middle_content">
            {{ prepareProjService.marketPriceIncludeTax.toLocaleString() }}
          </span>
          <span class="unit mr-7">元</span>
        </div>
        <div>
          <span class="middle_title">折扣</span>
          <span class="middle_content">
            {{ prepareProjService.discountPercentage * 10 }}
          </span>
          <span class="unit">折</span>
        </div>
        <div class="right_block">
          <span class="left_title">小計(未税)</span>
          <span class="middle_content">
            {{ prepareProjService.price.toLocaleString() }}
          </span>
          <span class="unit">元</span>
        </div>
      </div>

      <div class="open_content mb-3">
        <div>
          <span class="left_title">成交單價(含税)</span>
          <span class="middle_content">
            {{ prepareProjService.unitPriceIncludeTax.toLocaleString() }}
          </span>
          <span class="unit mr-7">元</span>
        </div>
      </div>

      <div class="open_content note">
        <div><span class="left_title">備註</span></div>
        <div class="middle_content">
          <el-input
            v-model="prepareProjService.note"
            :autosize="{ minRows: 4 }"
            type="textarea"
            placeholder="請輸入"
            maxlength="500"
            class="input_field"
            show-word-limit
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePullCueStore } from "@/stores/pullCue.js";

const props = defineProps({
  pullCue: {
    type: Function,
    default: () => {}
  }
});
const pullCueStore = usePullCueStore();
const prepareProjService = computed(() => pullCueStore.prepareProjService);
const priceIncludeTaxRef = ref(null);
const priceIncludeTax = prepareProjService.value.priceIncludeTax;

// 打勾
const setOherAd = event => {
  if (!event.target.checked) {
    prepareProjService.value.free = false;
    prepareProjService.value.priceIncludeTax = priceIncludeTax;
  }
  if (
    event.target.checked &&
    !prepareProjService.value.free &&
    (!prepareProjService.value.priceIncludeTax ||
      prepareProjService.value.priceIncludeTax === "0")
  ) {
    priceIncludeTaxRef.value.focus();
    return;
  }
  props.pullCue();
};

// 贈送
const setFree = event => {
  event.target.checked
    ? (prepareProjService.value.priceIncludeTax = 0)
    : (prepareProjService.value.priceIncludeTax = priceIncludeTax);

  if (
    event.target.checked ||
    (!event.target.checked && prepareProjService.value.priceIncludeTax !== 0)
  )
    props.pullCue();
};

// 有打勾且有填小計
const getPullCue = () => {
  if (
    prepareProjService.value.checked &&
    prepareProjService.value.priceIncludeTax !== "0"
  )
    props.pullCue();
};
</script>

<style lang="scss" scoped>
.checked_block {
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.item_block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 1.38px;

  .left_content {
    color: #333;

    span {
      margin-right: 0;
    }
  }

  .item_giveAway {
    span {
      margin-right: 0;
    }
  }

  input {
    background-color: #fff;
  }
}

.item_open_block {
  margin-top: 10px;
  background-color: #e6f9fa;
  padding: 8px 0 16px 32px;
}

.open_content {
  display: flex;
  align-items: center;
  letter-spacing: 1.38px;

  .right_block {
    margin-left: auto;

    .left_title {
      width: 100px;
      margin-right: 0;
      display: initial;
    }

    .middle_content {
      width: 124px;
      display: inline-block;
      text-align: right;
    }
  }

  .left_title {
    display: inline-block;
    width: 120px;
    margin-right: 28px;
  }

  .middle_title {
    display: inline-block;
    width: 35px;
    margin-right: 28px;
  }

  .middle_content {
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: 1.38px;
    color: #19b9c0;
    width: 82%;
  }

  &.note {
    align-items: flex-start;
  }
}

span {
  &.unit {
    font-size: 14px;
    color: #7e7e7e;
    margin-left: 4px;
  }
}
</style>
