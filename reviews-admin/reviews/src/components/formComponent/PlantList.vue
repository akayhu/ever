<template>
  <div class="overflow-hidden">
    <div class="slider">
      <div class="plant-list slider-container">
        <div
          v-for="plant in plantList"
          :key="plant.label"
          :data-gtm-form="plant.label"
          class="pr-4"
          @click="plantSelectorHandler(plant.value)"
        >
          <div
            class="plant-icon mb-1 rounded-circle"
            :class="{
              selected: currentPlantId === plant.value
            }"
          >
            <img :src="getAnonymousImgUrl(plant.value)" />
          </div>
          <div class="plant-name t5 text-center">
            {{ plant.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
export default {
  name: "PlantList",
  props: {
    currentPlantId: {
      type: Number,
      required: true
    }
  },
  mixins: [commonMixins],
  data: function() {
    return {
      plantList: this.getAnonymousPlantsData()
    };
  },
  methods: {
    plantSelectorHandler(plantId) {
      if (plantId === this.currentPlantId) return;
      this.$emit("click", plantId);
    }
  }
};
</script>

<style lang="scss" scoped>
.slider {
  overflow-x: auto;
  scroll-behavior: smooth;
  .slider-container {
    display: flex;
    padding-bottom: 12px;
    width: fit-content;
    white-space: nowrap;
    height: 100%;
  }
}
</style>
