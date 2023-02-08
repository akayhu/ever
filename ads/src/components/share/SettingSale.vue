<template>
  <div>
    <Modal
      ref="settingSale"
      :isShow="settingSaleStatus"
      @close="closeSettingSale"
      title="設定銷用內容"
      width="711"
    >
      <template #body>
        <div class="sale_block">
          <div v-if="type === 0">
            <div>銷用內容<span class="necessary">*</span></div>
            <div>
              <label class="ad-radio-label">
                <input
                  type="radio"
                  v-model="sales"
                  name="text"
                  :value="0"
                  @change="changeGiveaway"
                />
                <span class="ad-radio"></span>原合約
              </label>
            </div>
          </div>
          <div v-if="type === 0">
            <div></div>
            <div class="d-flex align-items-center">
              <label class="ad-radio-label">
                <input
                  type="radio"
                  v-model="sales"
                  name="text"
                  :value="1"
                  @change="changeGiveaway"
                />
                <span class="ad-radio"></span>曝光專案
              </label>
              <img
                v-tooltip="{
                  placement: 'right',
                  offset: 5,
                  content: '放指定專案的素材<br>數據歸在該專案內',
                  trigger: 'hover'
                }"
                src="@/assets/icon/ic-help-outline.svg"
                class="mr-7"
              />
              <SelectDropdown
                :disabled="sales !== 1"
                @value-changed="setSelectedMarketingProject($event)"
                :value="selectedMarketingProject"
                :options="searchedProjectOptions"
                :asncSearchCb="projectRecommendSearch"
                :filterable="true"
                :remote="true"
                :optionsAllData="true"
                :clearable="true"
                placeholder="輸入銷用專案"
              />
            </div>
            <div v-if="v$.$dirty && v$.usageInfo.$error" class="error_message">
              請輸入專案名稱
            </div>
          </div>
          <div v-if="type === 0">
            <div></div>
            <div class="d-flex align-items-center">
              <label class="ad-radio-label">
                <input
                  type="radio"
                  v-model="sales"
                  name="text"
                  :value="3"
                  @change="changeGiveaway"
                />
                <span class="ad-radio"></span>舊單PR
              </label>
              <img
                v-tooltip="{
                  placement: 'right',
                  offset: 5,
                  content: '拉指定專案的Cue<br>扣該專案的錢',
                  trigger: 'hover'
                }"
                src="@/assets/icon/ic-help-outline.svg"
                class="mr-7"
              />
              <SelectDropdown
                :disabled="sales !== 3"
                @value-changed="setOldPRMarketingProject($event)"
                :value="selectedDeduction"
                :options="searchedProjectOptions"
                :asncSearchCb="projectRecommendSearch"
                :filterable="true"
                :remote="true"
                :optionsAllData="true"
                :clearable="true"
                placeholder="輸入銷用專案"
              />
            </div>
            <div
              v-if="v$.$dirty && v$.deductionInfo.$error"
              class="error_message"
            >
              請輸入專案名稱
            </div>
          </div>
          <div v-if="type === 0">
            <div></div>
            <div>
              <label class="ad-radio-label">
                <input
                  type="radio"
                  v-model="sales"
                  @change="changeGiveaway"
                  name="text"
                  :value="2"
                  id="r2"
                />
                <span class="ad-radio"></span>成效PR
              </label>
              (請於備註欄填寫PR原因)
            </div>
          </div>
          <div v-if="type === 1">
            <div>銷用內容</div>
            <div>
              <div class="d-flex align-items-center">
                <label class="ad-radio-label">
                  <input
                    type="radio"
                    v-model="sales"
                    name="text"
                    :value="1"
                    @change="changeGiveaway"
                  />
                  <span class="ad-radio"></span>企業
                </label>
                <SelectDropdown
                  @value-changed="setSelectedMarketingProject($event)"
                  :value="selectedMarketingProject"
                  :options="searchedProjectOptions"
                  :asncSearchCb="projectRecommendSearch"
                  :filterable="true"
                  :remote="true"
                  :optionsAllData="true"
                  :clearable="true"
                  placeholder="輸入銷用專案"
                />
              </div>
            </div>
          </div>
          <div v-if="type === 1">
            <div></div>
            <div>
              <label class="ad-radio-label">
                <input
                  type="radio"
                  v-model="sales"
                  name="text"
                  :value="2"
                  @change="changeGiveaway"
                />
                <span class="ad-radio"></span>內部
              </label>
            </div>
          </div>
          <div>
            <div>備註<span class="necessary">*</span></div>
            <div>
              <el-input
                v-model="data.note"
                :autosize="{ minRows: 4 }"
                type="textarea"
                placeholder="請輸入"
                maxlength="500"
                :class="{ error_message_border: v$.$dirty && v$.note.$error }"
                class="input_field"
                show-word-limit
              />
              <div v-if="v$.$dirty && v$.note.$error" class="error_message">
                請輸入備註
              </div>
            </div>
          </div>
        </div>
        <div class="button_block">
          <button class="button_bg_white_large mr-7" @click="closeSettingSale">
            取消
          </button>
          <button class="button_bg_blue_large" @click="saveSettingAgent">
            確定
          </button>
        </div>
      </template>
    </Modal>

    <Dialog
      v-if="showDialog"
      @dialogCancel="showDialog = false"
      @dialogConfirm="showDialog = false"
      :isShow="showDialog"
      :cancelButton="false"
      title="確定"
      content="銷用內容已設定"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { requiredIf } from "@vuelidate/validators";
import useSelectProject from "@/composables/useSelectProject";
import Modal from "@/components/share/Modal.vue";
import Dialog from "@/components/Dialog.vue";
import SelectDropdown from "@/components/share/SelectDropdown";

export default defineComponent({
  name: "SettingSale",
  components: {
    Modal,
    Dialog,
    SelectDropdown
  },
  props: {
    product: {
      type: Object
    },
    settingSaleStatus: {
      type: Boolean,
      default: false
    },
    closeSettingSale: {
      type: Function
    },
    saveSetting: {
      type: Function
    },
    // 0：一般專案 1:空版專案
    type: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const {
      searchedProjectOptions,
      projectRecommendSearch
    } = useSelectProject();

    const sales = ref(0);
    const data = ref({});
    const showDialog = ref(false);
    const selectedMarketingProject = ref("");
    const selectedDeduction = ref("");

    const rules = {
      usageInfo: {
        projectName: requiredIf(() => sales.value === 1)
      },
      deductionInfo: {
        projectName: requiredIf(() => sales.value == 3)
      },
      note: { required: requiredIf(() => sales.value == 2) }
    };
    const v$ = useVuelidate(rules, data);

    // 儲存設定專案內容
    const saveSettingAgent = () => {
      v$.value.$touch();
      if (v$.value.$error) return;

      v$.value.$reset();
      props.saveSetting(data.value);
      showDialog.value = true;
    };

    // 選擇銷用內容
    const changeGiveaway = () => {
      v$.value.$reset();
      data.value.usage = 0;
      data.value.deduction = 0;
      data.value.giveaway = 0;
      selectedMarketingProject.value = "";
      selectedDeduction.value = "";

      if (sales.value === 2 && props.type === 0) {
        data.value.giveaway = 1;
      }
    };

    // 選擇曝光專案
    const setSelectedMarketingProject = val => {
      if (val) {
        selectedMarketingProject.value = searchedProjectOptions.value.find(
          option => option.value === val.value
        ).label;
        data.value.usage = val.value;
        data.value.usageInfo = {
          projectName: val.label
        };
      } else {
        selectedMarketingProject.value = "";
        data.value.usage = 0;
      }
    };

    // 選擇舊單 PR
    const setOldPRMarketingProject = val => {
      if (val) {
        selectedDeduction.value = searchedProjectOptions.value.find(
          option => option.value === val.value
        ).label;
        data.value.deduction = val.value;
        data.value.deductionInfo = {
          projectName: val.label
        };
      } else {
        selectedDeduction.value = "";
        data.value.deduction = 0;
      }
    };

    const init = () => {
      v$.value.$reset();
      data.value = {
        usage: props.product.usage,
        usageInfo: props.product.usageInfo?.projectName,
        giveaway: props.product.giveaway,
        deduction: props.product.deduction,
        deductionInfo: props.product.deductionInfo?.projectName,
        note: props.product.note
      };
      selectedMarketingProject.value =
        props.product.usageInfo?.projectName || "";
      selectedDeduction.value = props.product.deductionInfo?.projectName || "";
      if (props.product.usage > 0) {
        //曝光專案
        sales.value = 1;
      } else if (props.product.giveaway > 0 || props.type === 1) {
        // 成效PR
        sales.value = 2;
      } else if (props.product.deduction > 0) {
        // 舊單PR
        sales.value = 3;
      } else {
        sales.value = 0;
      }
    };

    // onCreate
    init();

    return {
      v$,
      sales,
      data,
      showDialog,
      searchedProjectOptions,
      selectedMarketingProject,
      selectedDeduction,
      changeGiveaway,
      saveSettingAgent,
      projectRecommendSearch,
      setSelectedMarketingProject,
      setOldPRMarketingProject,
      init
    };
  }
});
</script>

<style lang="scss" scoped>
.sale_block {
  padding-bottom: 8px;
  padding: 0 0 8px 16px;
  border-bottom: 1px solid #ddd;

  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 12px;

    > div {
      &:first-child {
        width: 78px;
        margin-right: 28px;
      }
    }

    div {
      &.d-flex {
        .ad-radio-label {
          width: 100px;
        }

        ::v-deep .el-select {
          width: 280px;
        }
      }

      .input_field {
        ::v-deep textarea {
          background-color: #f3f3f3;
          border: 1px solid #ddd;
          font-size: 16px;
          width: 480px;
        }

        ::v-deep span {
          background-color: transparent;
        }
      }
    }

    &:last-child {
      align-items: flex-start;
    }
  }

  .error_message {
    margin: 6px auto 0;
  }
}

.button_block {
  text-align: center;
  margin-top: 24px;
}
</style>
