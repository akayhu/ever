import { ref } from "vue";
import { apiGetAccountSearch } from "@/apis/account";

const useSelectUser = () => {
  const selectedUser = ref({ id: "", name: "", label: "" });
  const searchedAccountOptions = ref([]);

  const accountSuggestSearch = async keyword => {
    if (!keyword) return;
    if (keyword.length >= 2) {
      try {
        const {
          data: { response: responseData }
        } = await apiGetAccountSearch({ keyword });
        searchedAccountOptions.value = [...responseData].map(item => {
          return {
            ...item,
            value: item.accountId,
            label: `${item.name}(${item.accountId})`
          };
        });
        return searchedAccountOptions.value;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setSelectedAccount = data => {
    if (!data.accountId) {
      selectedUser.value = { name: "", accountId: 0 };
    }

    selectedUser.value = {
      accountId: data.id,
      name: data.name,
      label: data.label
    };

    return selectedUser;
  };

  return {
    selectedUser,
    searchedAccountOptions,
    accountSuggestSearch,
    setSelectedAccount
  };
};

export default useSelectUser;
