<template>
  <div class="pt-6" :class="{ checked_block: item.checked }">
    <div class="item_block">
      <div class="left_content">
        <input
          type="checkbox"
          v-model="item.checked"
          :id="`item_${index}`"
          @change="setBannerAd"
        />
        <label :for="`item_${index}`" class="mr-2">
          <span class="mr-2"></span>{{ item.startDate }} ~ {{ item.endDate }}
        </label>
        <span class="mr-6 days"
          >( <span>{{ item.days }}</span> 天 )</span
        >
        <input
          type="checkbox"
          v-model="item.free"
          :id="`item_giveAway_${index}`"
          @change="setFree"
        />
        <label :for="`item_giveAway_${index}`" class="item_giveAway">
          <span></span>
          贈送
        </label>
      </div>
      <div>
        <span class="mr-7">小計(含税)</span>
        <input
          ref="priceIncludeTaxRef"
          v-model="item.priceIncludeTax"
          type="text"
          :disabled="item.free"
          widthType="96"
          @blur="getPullCue"
          @keyup.enter="getPullCue"
        />
        <span class="unit">元</span>
      </div>
    </div>

    <!-- 勾選後長出的區塊 -->
    <div v-if="item.checked" class="item_open_block">
      <div v-if="!loading" class="open_content mb-3">
        <div>
          <span class="left_title">牌價(含稅)</span>
          <span class="middle_content">
            {{ item.marketPriceIncludeTax.toLocaleString() }}
          </span>
          <span class="unit mr-7">元</span>
        </div>
        <div>
          <span class="middle_title">折扣</span>
          <span class="middle_content">
            {{ item.discountPercentage * 10 }}
          </span>
          <span class="unit">折</span>
        </div>
        <div class="right_block">
          <span class="left_title">小計(未税)</span>
          <span class="middle_content">
            {{ item.price.toLocaleString() }}
          </span>
          <span class="unit">元</span>
        </div>
      </div>

      <div v-if="!loading" class="open_content">
        <div>
          <span class="left_title">成交單價(含稅)</span>
          <span class="middle_content">
            {{ item.unitPriceIncludeTax.toLocaleString() }}
          </span>
          <span class="unit mr-7">元</span>
        </div>
      </div>

      <Loading v-if="loading" size="30" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { usePullCueStore } from "@/stores/pullCue.js";
import Loading from "@/components/Loading.vue";

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: Object,
    required: true
  },
  pullCue: {
    type: Function,
    default: () => {}
  },
  offCheckedCancelPullCueCheckbox: {
    type: Function,
    default: () => {}
  },
  productData: {
    type: Object,
    default: () => {}
  }
});
const pullCueStore = usePullCueStore();
const { getProductCalculatePrice } = pullCueStore;
const paymentTaxRate = computed(
  () => pullCueStore.quotationData.paymentTaxRate
);
const priceIncludeTaxRef = ref(null);
const loading = ref(false);
const priceIncludeTax = props.item.priceIncludeTax;

// 打勾
const setBannerAd = event => {
  props.offCheckedCancelPullCueCheckbox();
  if (!event.target.checked) {
    props.item.free = false;
    props.item.priceIncludeTax = priceIncludeTax;
  }
  if (
    event.target.checked &&
    !props.item.free &&
    (!props.item.priceIncludeTax || props.item.priceIncludeTax === "0")
  ) {
    priceIncludeTaxRef.value.focus();
    return;
  }
  props.pullCue();
};

// 贈送
const setFree = event => {
  event.target.checked
    ? (props.item.priceIncludeTax = 0)
    : (props.item.priceIncludeTax = priceIncludeTax);

  if (
    (props.item.checked && event.target.checked) ||
    (!event.target.checked && props.item.priceIncludeTax !== 0)
  ) {
    calculate();
    props.pullCue();
  }
};

// 有打勾且有填小計
const getPullCue = () => {
  if (props.item.checked && props.item.priceIncludeTax !== "0") {
    calculate();
    props.pullCue();
  }
};

// 連動計算
const calculate = () => {
  loading.value = true;
  const query = {
    free: props.item.free ? 1 : 0,
    marketPriceIncludeTax: props.item.marketPriceIncludeTax,
    priceIncludeTax: props.item.priceIncludeTax,
    productId: props.productData.productId,
    quantity: props.item.days,
    taxRate: paymentTaxRate.value,
    unit: "DAY"
  };

  getProductCalculatePrice(query)
    .then(res => {
      props.item.discountPercentage = res.discountPercentage * 10;
      props.item.price = res.price.toLocaleString();
      props.item.unitPriceIncludeTax = res.unitPriceIncludeTax.toLocaleString();
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
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

  span {
    margin-right: 0;
  }

  .days {
    color: #7e7e7e;

    span {
      color: #33b3ba;
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
