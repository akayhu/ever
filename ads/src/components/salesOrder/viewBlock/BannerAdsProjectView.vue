<template>
  <div class="booking_project_main">
    <div
      v-for="(project, projectIndex) in salesOrderStore.projectList"
      :key="projectIndex"
      class="project_container"
    >
      <ProjectViewGroup :project="project" :projectIndex="projectIndex" />
    </div>
  </div>
</template>

<script>
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import ProjectViewGroup from "@/components/salesOrder/viewBlock/ProjectViewGroup.vue";

export default {
  components: {
    ProjectViewGroup
  },
  setup() {
    const salesOrderStore = useSalesOrderStore();
    return { salesOrderStore };
  }
};
</script>

<style lang="scss" scoped>
.project_container {
  &:not(:first-child) {
    padding-top: 40px;
  }
}
</style>
