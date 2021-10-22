<template>
  <div v-click-outside="close" class="popout-container" @click="show = true">
    <component :is="tag">{{ text }}</component>
    <div :class="{ popout: true, show }">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: 'div'
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    close() {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.popout-container {
  position: relative;
}
.popout {
  display: none;
  position: absolute;
  top: calc(100% + 0.1rem);
  left: 0;
  background-color: white;
  width: 300px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  border: 1px solid #ddd;
  padding: 1rem;
  z-index: 100;
  &.show {
    display: block;
  }
}
</style>
