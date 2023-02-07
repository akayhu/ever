<template>
  <div class="company-header">
    <Logo :src="src" :name="name" :logoClass="logoClass"></Logo>
    <template v-if="link.length">
      <a
        class="company-link"
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        v-gtm="gtm"
      >
        {{ name }}
      </a>
    </template>
    <template v-else>
      <router-link
        class="company-link"
        :to="{
          name: 'companyReviews',
          params: { custno: custnoEncoded }
        }"
        target="_blank"
        rel="noopener noreferrer"
        v-gtm="gtm"
      >
        {{ name }}
      </router-link>
    </template>
  </div>
</template>

<script>
import Logo from "@/components/Logo.vue";
import { encodeCustno } from "@/utils/index";
import setGtmDirective from "@/directive/setGtmDirective.js";
export default {
  name: "CompanyHeader",
  components: {
    Logo
  },
  props: {
    src: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    custno: {
      type: [String, Number],
      default: ""
    },
    link: {
      type: String,
      default: ""
    },
    logoClass: {
      type: String,
      default: ""
    },
    gtm: {
      type: Object,
      default: () => ({})
    }
  },
  directives: {
    setGtmDirective
  },
  computed: {
    custnoEncoded() {
      return encodeCustno(this.custno);
    }
  }
};
</script>

<style lang="scss" scoped>
.company-header {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.75;
  max-width: 100%;
  @include device-up(md) {
    font-size: 18px;
    line-height: 1.33;
  }
}
a {
  display: block;
  color: get-color(link);
  @include truncate-text();
  &:hover {
    color: get-color(link-hover);
  }
  &[disabled] {
    color: get-color(disable);
  }
  &.multi-overflow {
    display: -webkit-box;
    white-space: unset;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
