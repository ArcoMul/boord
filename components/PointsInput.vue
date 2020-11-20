<template>
  <input type="number" :value="value" @input="$emit('update', $event.target.value)">
</template>

<script>
export default {
  props: {
    value: Number
  }
}
</script>

<style scoped>
input {
  width: 100%;
}
</style>