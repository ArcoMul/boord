<template>
  <b-modal
    v-if="showModal"
    v-model="showModal"
    size="lg"
    hide-header
    hide-footer
    modal-class="board-modal"
    :key="section.id"
    @hide="onHide"
  >
    <b-row>
      <b-col>
        <Editable
          tag="h2"
          spellcheck
          placeholder="Enter a section title..."
          :content="section.name"
          :close-on-break="true"
          @update="updateSectionName(section, $event)"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="10">
        <EditableMarkdown
          tag="p"
          class="markdown"
          spellcheck
          placeholder="Enter a section description..."
          :content="section.text"
          @update="updateSectionText(section, $event)"
        />
      </b-col>
      <b-col cols="2">
        <confirm-link
          tag="div"
          title="Remove section"
          :message="`Are you sure you want to remove the section '${section.name}'`"
          @confirm="() => removeSection(section)"
        >
          <b-button class="remove-button" variant="danger">Remove</b-button>
        </confirm-link>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import Editable from '~/components/Editable.vue'
import EditableMarkdown from '~/components/EditableMarkdown.vue'
import ConfirmLink from '~/components/ConfirmLink.vue'
import Modal from '~/components/mixins/Modal'

export default {
  mixins: [Modal],
  components: {
    Editable,
    EditableMarkdown,
    ConfirmLink
  },
  props: {
    sectionId: {
      type: String
    }
  },
  data() {
    return {
      showModal: !!this.sectionId
    }
  },
  computed: {
    section() {
      return this.$store.state.board.sections.filter(
        s => s.id === this.sectionId
      )[0]
    }
  },
  watch: {
    sectionId() {
      this.showModal = !!this.sectionId
    }
  },
  methods: {
    updateSectionName(section, $event) {
      this.$store.dispatch('updateSectionName', {
        id: section.id,
        name: $event
      })
    },
    updateSectionText(_section, $event) {
      const section = Object.assign({}, _section)
      section.text = $event
      this.$store.dispatch('updateSection', {
        section
      })
    },
    removeSection(_section) {
      const section = Object.assign({}, _section)
      this.$store.dispatch('removeSection', { section })
      this.close()
    }
  }
}
</script>
