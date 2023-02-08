<template>
  <div class="common_contact">
    <div v-if="isLoading">
      <Loading size="24" />
    </div>
    <div
      v-if="contactList.loadedContents.length === 0 && !isLoading"
      class="text-center mt-6"
    >
      目前暫無常用聯絡人資訊
    </div>
    <div
      v-else
      class="contact"
      v-for="contact in contactList.loadedContents"
      :key="contact.companyContact"
    >
      <div>
        <div class="mb-2 common_main">
          <label class="label_field">公司負責人</label>
          <span>{{ contact.companyLeader }}</span>
        </div>
        <div class="mb-2 common_main">
          <label class="label_field">公司電話</label>
          <span>{{ contact.companyPhone }}</span>
        </div>
        <div class="mb-2 common_main">
          <label class="label_field">公司傳真</label>
          <span>{{ contact.companyFax }}</span>
        </div>
        <div class="mb-2 common_main">
          <label class="label_field">公司地址</label>
          <span>{{ contact.companyAddress }}</span>
        </div>
        <div class="mb-2 common_main">
          <label class="label_field">公司聯絡人</label>
          <span>{{ contact.companyContact }}</span>
        </div>
        <div class="mb-2 common_main">
          <label class="label_field">聯絡人職稱</label>
          <span>{{ contact.companyContactJobTitle }}</span>
        </div>
        <div class="mb-2 common_main">
          <label class="label_field">聯絡人部門</label>
          <span>{{ contact.companyContactDepartment }}</span>
        </div>
        <div class="common_main">
          <label class="label_field">聯絡人EMail</label>
          <span>{{ contact.companyContactEmail }}</span>
        </div>
      </div>
      <div class="d-flex flex-wrap">
        <button
          type="button"
          class="button_bg_blue_medium w-100 mb-4"
          @click="closeModal(contact)"
        >
          套用
        </button>
        <button
          type="button"
          class="button_bg_white_smaller w-100 "
          @click="deleteContact(contact)"
        >
          刪除
        </button>
      </div>
    </div>
    <span v-if="contactList.loadedContents.length > 2" class="infinite_loader">
      <InfiniteLoading @intersect="intersected" :isLoading="isLoading" />
    </span>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, toRefs } from "vue";
import { useSalesOrderStore } from "@/stores/salesOrder.js";
import Loading from "@/components/Loading.vue";
import InfiniteLoading from "@/components/InfiniteLoading.vue";

export default defineComponent({
  components: {
    Loading,
    InfiniteLoading
  },
  props: {
    closeContactDialog: {
      type: Function,
      default: () => {}
    }
  },
  setup(props) {
    const isLoading = ref(false);
    const salesOrderStore = useSalesOrderStore();
    const { contactList } = toRefs(salesOrderStore);
    const pageParams = {
      page: 1,
      size: 4
    };

    const closeModal = contact => {
      salesOrderStore.applyContact(contact);
      props.closeContactDialog();
    };

    const deleteContact = async contact => {
      isLoading.value = true;
      await salesOrderStore.deleteContact(contact);
      pageParams.page = 1;
      await salesOrderStore.getContactList(pageParams);
      isLoading.value = false;
    };

    const intersected = async () => {
      isLoading.value = true;
      pageParams.page++;
      await salesOrderStore.getContactList(pageParams);
      isLoading.value = false;
    };

    onMounted(async () => {
      isLoading.value = true;
      await salesOrderStore.getContactList(pageParams);
      isLoading.value = false;
    });

    return {
      isLoading,
      contactList,
      closeModal,
      deleteContact,
      intersected
    };
  }
});
</script>

<style lang="scss" scoped>
.common_contact {
  .contact {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;

    .common_main {
      font-weight: bold;
      display: flex;

      span {
        color: #7e7e7e;
        width: 350px;
        word-break: break-all;
      }
    }

    .label_field {
      width: 102px;
      margin-right: 28px;
    }

    &:hover {
      background-color: #e6f9fa;
    }
  }
}

.infinite_loader {
  display: block;
  margin-top: 20px;
}
</style>
