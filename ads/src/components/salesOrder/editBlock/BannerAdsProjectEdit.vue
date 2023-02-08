<template>
  <div>
    <div
      v-for="(project, projectIndex) in salesOrderStore.projectList"
      :key="project.tempId"
      class="project_container"
    >
      <ProjectGroup :project="project" :projectIndex="projectIndex" />
    </div>

    <div class="add_project">
      <span @click="createProject">新增專案 ＋</span>
    </div>
  </div>
</template>

<script>
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import ProjectGroup from "@/components/salesOrder/quoteContentComponent/ProjectGroup.vue";

export default {
  components: {
    ProjectGroup
  },
  setup() {
    const salesOrderStore = useSalesOrderStore();

    // 新增專案
    const createProject = () => {
      salesOrderStore.createProject();
    };

    return {
      salesOrderStore,
      createProject
    };
  }
};
</script>

<style lang="scss" scoped>
.project_container {
  &:not(:first-child) {
    padding-top: 40px;
  }
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
</style>
