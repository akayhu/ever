import { ref, onMounted } from "vue";
import { apiGetProjectRecommend } from "@/apis/project";
import { useRoute } from "@/router/useRoute.js";
import { stringifyObjQuery, parseObjQuery } from "@/utils/queryString";

const useSelectProject = () => {
  const { route, router } = useRoute();
  const selectedProject = ref({ name: "", id: "" });
  const searchedProjectOptions = ref([]);

  const projectRecommendSearch = async keyword => {
    if (!keyword) return;
    if (keyword.length >= 2) {
      const {
        data: { response: responseData }
      } = await apiGetProjectRecommend({
        keyword
      });
      searchedProjectOptions.value = [...responseData].map(item => {
        return {
          ...item,
          value: item.projectId,
          label: item.projectName
        };
      });
    }
    return searchedProjectOptions.value;
  };

  const handleSelectProject = data => {
    if (!data.id) {
      selectedProject.value = { name: "", id: 0 };
    }

    selectedProject.value = {
      id: data.projectId,
      name: data.projectName
    };
    // selectedProject.value = data;
  };

  const setRouteQuery = path => {
    if (selectedProject.value.id) {
      const query = route.query;
      router
        .push({
          path,
          query: {
            ...query,
            selectedProject: stringifyObjQuery(selectedProject.value)
          }
        })
        .catch(() => {});
    }
  };

  onMounted(() => {
    if (route.query.selectedProject) {
      selectedProject.value = parseObjQuery(route.query.selectedProject);
    }
  });

  return {
    selectedProject,
    searchedProjectOptions,
    projectRecommendSearch,
    handleSelectProject,
    setRouteQuery
  };
};

export default useSelectProject;
