<template>
  <div>
    <div
      v-for="label in selectedLabels"
      :key="label._id"
      class="label"
      :style="{ backgroundColor: label.color }"
    >
      {{ label.name }}
    </div>
    <Popout
      tag="div"
      class="add"
      :text="selected.length === 0 ? '+ Add label' : '+'"
    >
      <div
        v-for="label in labels"
        :key="label._id"
        :style="{ backgroundColor: label.color }"
        class="popout-label"
      >
        {{ label.name }}
      </div>
    </Popout>
  </div>
</template>

<script>
import Popout from '~/components/Popout.vue'

export default {
  components: {
    Popout
  },
  props: {
    labels: {
      type: Array,
      default() {
        return []
      }
    },
    selected: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    selectedLabels() {
      return this.selected.map(s => this.labels[s])
    }
  }
}
</script>

<style lang="scss" scoped>
.label,
.add {
  display: inline-block;
  line-height: 0.8rem;
  font-size: 0.8rem;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 3px;
}
.add {
  background-color: #eee;
  min-width: 1.8rem;
  text-align: center;
  cursor: pointer;
}
.popout-label {
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 3px;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}
</style>
