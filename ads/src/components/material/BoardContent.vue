<template>
  <section class="border_content_wrapper">
    <div>
      您正在上傳版位
      <span>
        {{ tagData.device }}/{{ tagData.channelName }}/{{ tagData.boardName }}
      </span>
    </div>
    <div>
      曝光日期
      <span>
        {{ tagData.startDate }} ~ {{ tagData.endDate }} (ID:{{
          tagData.reservationId
        }})
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: "BoardContent",
  props: {
    tagData: {
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.border_content_wrapper {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 1.38px;
  color: #292929;

  div {
    span {
      color: #00afb8;
    }
  }
}
</style>
