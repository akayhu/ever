<template>
  <section class="section_container">
    <div class="d-flex justify-content-between">
      <h2 class="mb-6" id="contract_content_title">服務內容</h2>
    </div>

    <div class="content">
      <div class="title">banner廣告</div>
      <div
        v-for="(project, projectIndex) in salesOrderStore.projectList"
        :key="project.tempId"
        class="project_group"
      >
        <ProjectGroup :project="project" :projectIndex="projectIndex" />
      </div>

      <div v-if="canEdit" class="add_project">
        <span @click="salesOrderStore.createProject">新增專案 ＋</span>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import { getNumberConverter } from "@/utils/util.js";
import { useFormStatus } from "@/composables/quotation/useFormStatus.js";
import ProjectGroup from "@/components/internalOrder/ProjectGroup.vue";

export default {
  components: {
    ProjectGroup
  },
  setup() {
    const salesOrderStore = useSalesOrderStore();
    const { canEditNew, isEditForm, isViewForm } = useFormStatus();
    const quotationData = computed(() => salesOrderStore.quotationData);
    const canEdit = computed(() => canEditNew(quotationData.value).edit);
    return {
      salesOrderStore,
      isEditForm,
      isViewForm,
      canEdit,
      getNumberConverter
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";
@import "~scss/views/orderManage/internalOrder";

.label_field {
  margin-right: 28px;
}

.content {
  .title {
    font-size: 18px;
    line-height: 28px;
    letter-spacing: 1.26px;
    font-weight: bold;
    color: #292929;
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    &::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 28px;
      background-color: #00b2ba;
      margin-right: 8px;
    }
  }

  .project_group {
    padding-top: 20px;
  }

  .add_project {
    border-top: 1px solid #d6d6d6;
    position: relative;
    margin: 27px 0 34px;

    span {
      background-color: #fff;
      padding: 0 12px;
      position: absolute;
      top: -11px;
      left: 50%;
      margin-left: -56px;
      cursor: pointer;
    }
  }
}
</style>
