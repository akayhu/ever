import { ref, onMounted } from "vue";
import { apiGetCustomerSuggestionKeyword } from "@/apis/project";
import { useRoute } from "@/router/useRoute.js";
import { stringifyObjQuery, parseObjQuery } from "@/utils/queryString";

const useSelectCompany = () => {
  const { route, router } = useRoute();
  const selectedCompany = ref({ id: "", name: "" });
  const searchedCompanyOptions = ref([]);

  const companySuggestSearch = async keyword => {
    if (!keyword) return;
    if (keyword.length >= 2) {
      try {
        const {
          data: { response: responseData }
        } = await apiGetCustomerSuggestionKeyword({ keyword });
        searchedCompanyOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          };
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSelectCompany = companyData => {
    if (!companyData.id) {
      selectedCompany.value = { name: "", id: 0 };
    }

    selectedCompany.value = {
      id: companyData.id,
      name: companyData.label
    };
  };

  const setRouteQuery = path => {
    if (selectedCompany.value.id) {
      const query = route.query;
      router
        .push({
          path,
          query: {
            ...query,
            selectedCompany: stringifyObjQuery(selectedCompany.value)
          }
        })
        .catch(() => {});
    }
  };

  onMounted(() => {
    if (route.query.selectedCompany) {
      selectedCompany.value = parseObjQuery(route.query.selectedCompany);
    }
  });

  return {
    selectedCompany,
    searchedCompanyOptions,
    companySuggestSearch,
    handleSelectCompany,
    setRouteQuery
  };
};

export default useSelectCompany;
