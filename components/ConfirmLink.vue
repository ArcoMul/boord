<template>
  <component :is="tag" @click.prevent="onClick">
    <slot/>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  methods: {
    async onClick() {
      const toConfirm = await this.$bvModal.msgBoxConfirm(this.message, {
        title: this.title
      })
      if (toConfirm) {
        this.$emit('confirm')
        return
      }
      this.$emit('cancel')
    }
  }
}
</script>