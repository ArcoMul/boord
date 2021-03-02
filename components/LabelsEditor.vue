<template>
  <div class="labels">
    <b-row v-for="(label, index) in labels" :key="label._id">
      <b-col>
        <div
          :class="{ color: true, 'mb-1': true, empty: !label.name }"
          :style="{ backgroundColor: label.color }"
        >
          <Editable
            tag="span"
            placeholder="Enter label name..."
            :content="label.name"
            :close-on-break="true"
            @update="onUpdate(index, $event)"
          />
        </div>
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
  &.empty {
    color: rgba(0, 0, 0, 0.5);
  }
  span:focus {
    outline: none;
  }
  span {
    display: inline-block;
  }
}
</style>

<!--
        <b-input
          type="color"
          :value="label.color"
          @change="(value) => updateLabelColor(label._id, value)"
        />
      </b-col>
      <b-col cols="6">
        <b-input
          type="text"
          :value="label.name"
          @change="(value) => updateLabelName(label._id, value)"
        />
      </b-col>
      <b-col cols="4">
        <b-checkbox
          :value="label.colorCard"
          @change="(value) => updateLabelColorCard(label._id, value)"
        />
      </b-col>
    </b-row>
  </div>
</template> -->