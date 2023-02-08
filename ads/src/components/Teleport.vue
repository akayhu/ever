<script>
export default {
  name: "teleport",
  props: {
    to: {
      type: String,
      required: true
    }
  },

  mounted() {
    let parentElement = document.querySelector(this.to);
    if (parentElement) {
      parentElement.appendChild(this.$el);
    }
  },

  destroyed() {
    let parentElement = document.querySelector(this.to);
    if (parentElement && this.$el && parentElement.contains(this.$el)) {
      parentElement.removeChild(this.$el);
    }
  },

  render() {
    return <div>{this.$scopedSlots.default()}</div>;
  }
};
</script>
