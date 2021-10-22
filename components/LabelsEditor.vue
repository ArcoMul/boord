<template>
  <div class="labels">
    <b-row v-for="(label, index) in labels" :key="label._id">
      <b-col>
          <Editable
            tag="div"
            :class="{ color: true, 'mb-1': true, empty: !label.name }"
            :style="{ backgroundColor: label.color }"
            placeholder="Enter label name..."
            :content="label.name"
            :close-on-break="true"
            @update="onUpdate(index, $event)"
          />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Editable from '~/components/Editable.vue'

export default {
  components: {
    Editable
  },
  props: {
    labels: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    onUpdate(index, $event) {
      const labels = this.labels.map(label => Object.assign({}, label))
      labels[index].name = $event
      this.$emit('update', labels)
    }
  }
}
</script>

<style lang="scss" scoped>
.color {
  width: 100%;
  height: 2.5rem;
  border-radius: 3px;
  line-height: 2.5rem;
  padding: 0 0.75rem;
  color: white;
  font-weight: bold;
  &.empty {
    color: rgba(255, 255, 255, 0.75);
    font-weight: normal;
  }
}
</style>
