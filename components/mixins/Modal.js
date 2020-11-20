export default {
  methods: {
    open() {
      this.showModal = true
    },
    close() {
      this.showModal = false
    },
    onHide() {
      this.$emit('close')
    }
  }
}
