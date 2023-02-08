import { ref, onMounted } from "vue";
// import { apiGetProjectRecommend } from "@/apis/project";
// import { apiGetFilterCustomerSuggest } from "@/apis/report";
// import { apiGetAccountSearch } from "@/apis/account";
import { useRoute } from "@/router/useRoute.js";
import { stringifyObjQuery, parseObjQuery } from "@/utils/queryString";

const useSelectValue = (
  selectKey,
  getOptionsAPI = null,
  idField = "id",
  nameField = "name"
) => {
  const { route, router } = useRoute();
  const selectedValue = ref({ id: "", name: "" });
  const searchedOptions = ref([]);

  const getOptions = async keyword => {
    if (!keyword) return;
    let apiFn = getOptionsAPI;
    if (keyword.length >= 2 && apiFn != null) {
      const {
        data: { response: responseData }
      } = await apiFn({ keyword });
      searchedOptions.value = [...responseData].map(item => {
        return {
          ...item,
          value: item[idField],
          label:
            selectKey === "selectedProject"
              ? item[nameField]
              : `${item[nameField]}(${item[idField]})`
        };
      });
    }
  };

  const handleChange = data => {
    if (data && data[idField]) {
      selectedValue.value = {
        id: data[idField],
        name: data.label
      };
    } else {
      selectedValue.value = { [idField]: "", [nameField]: "" };
    }
  };

  const setRouteQuery = () => {
    if (selectedValue.value.id) {
      const query = route.query;
      console.log(selectKey, query);
      console.log("value", selectedValue.value);
      router
        .push({
          query: {
            ...query,
            [selectKey]: stringifyObjQuery(selectedValue.value)
          }
        })
        .catch(() => {});
    }
  };

  onMounted(() => {
    if (route.query[selectKey]) {
      selectedValue.value = parseObjQuery(route.query[selectKey]);
    }
  });

  return {
    selectedValue,
    searchedOptions,
    getOptions,
    handleChange,
    setRouteQuery
  };
};

export default useSelectValue;
