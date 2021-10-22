<template>
  <div class="card-label-selector">
    <div
      v-for="label in selectedLabels"
      :key="label._id"
      class="label"
      :style="{ backgroundColor: label.color }"
      @click="$emit('remove-label', label)"
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
        :class="{
          'popout-label': true,
          'is-selected': selected.includes(label._id)
        }"
        @click="
          selected.includes(label._id)
            ? $emit('remove-label', label)
            : $emit('add-label', label)
        "
      >
        <span>{{ label.name }}</span>
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
    labelsMap() {
      return this.labels.reduce((map, label) => {
        map[label._id] = label
        return map
      }, {})
    },
    selectedLabels() {
      return this.selected.map(s => this.labelsMap[s])
    }
  }
}
</script>

<style lang="scss" scoped>
.card-label-selector {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}
.label,
.add {
  display: inline-block;
  line-height: 0.8rem;
  font-size: 0.8rem;
  padding: 0.5rem;
  border-radius: 3px;
  color: white;
  font-weight: bold;
  min-height: calc(0.8rem + 0.5rem + 0.5rem);
  min-width: calc(0.8rem + 0.5rem + 0.5rem);
  vertical-align: middle;
  cursor: pointer;
}
.add {
  background-color: #6c757d;
  min-width: 1.8rem;
  text-align: center;
}
.label:hover {
  text-decoration: line-through;
}
.popout-label {
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 3px;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  min-height: calc(0.8rem + 0.5rem + 0.5rem);
  color: white;
  font-weight: bold;
  &.is-selected {
    opacity: 0.5;
  }
}
</style>
