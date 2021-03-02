<template>
  <b-modal
    v-if="showModal"
    v-model="showModal"
    size="lg"
    hide-header
    hide-footer
    modal-class="board-modal"
    @hide="onHide"
  >
    <b-row>
      <b-col>
        <Editable
          tag="h2"
          spellcheck
          placeholder="Enter a board title..."
          :content="board.name"
          :close-on-break="true"
          @update="updateBoardName($event)"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <EditableMarkdown
          tag="p"
          class="markdown"
          spellcheck
          placeholder="Enter a board description..."
          :content="board.text"
          @update="updateBoardText($event)"
        />
      </b-col>
      <b-col cols="4">
        <div class="members">
          <h3>Members</h3>
          <UserCircles
            v-if="board.members.length > 0"
            :users="boardMembers"
            @onRemove="user => onRemoveMember(user._id)"
          />
          <i v-else>No members yet</i>
          <b-form @submit.prevent="onAddMember">
            <b-input-group class="mt-3">
              <b-form-input
                v-model="newMember"
                list="member-name-list"
                autocomplete="off"
                placeholder="Enter name..."
              ></b-form-input>
              <b-input-group-append>
                <b-button type="submit" variant="info">Add</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form>
          <datalist id="member-name-list">
            <option v-for="user in users" :key="user.email" :value="user.email">
              {{ user.name }}
            </option>
          </datalist>
        </div>

        <hr />

        <h3>Labels</h3>
        <LabelsEditor :labels="board.labels" @update="onLabelsUpdate" />
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import Editable from '~/components/Editable.vue'
import EditableMarkdown from '~/components/EditableMarkdown.vue'
import Modal from '~/components/mixins/Modal'
import UserCircles from '~/components/UserCircles.vue'
import LabelsEditor from '~/components/LabelsEditor.vue'

export default {
  components: {
    Editable,
    EditableMarkdown,
    UserCircles,
    LabelsEditor
  },
  mixins: [Modal],
  props: {
    show: {
      type: Boolean
    }
  },
  data() {
    return {
      showModal: this.show,
      newMember: '',
      users: []
    }
  },
  computed: {
    board() {
      return this.$store.state.board
    },
    members() {
      return this.$store.state.members
    },
    boardMembers() {
      return this.members.filter(member =>
        this.board.members.includes(member._id.toString())
      )
    }
  },
  watch: {
    show() {
      this.showModal = this.show
    },
  },
  async created() {
    if (!this.board.text) {
      this.board.text = ''
    }
    this.users = await this.$axios.$get('/api/users')
  },
  methods: {
    updateBoardName($event) {
      this.$store.dispatch('updateBoard', { name: $event })
    },
    updateBoardText($event) {
      this.$store.dispatch('updateBoard', { text: $event })
    },
    removeBoard() {
      // const section = Object.assign({}, _section)
      // this.$store.dispatch('removeSection', { section })
      // this.close()
    },
    onAddMember($event) {
      this.$store.dispatch('addBoardMember', { email: this.newMember })
    },
    onRemoveMember($event) {
      this.$store.dispatch('removeBoardMember', { id: $event })
    },
    onLabelsUpdate(labels) {
      this.$store.dispatch('updateBoard', { labels: labels })
    }
  }
}
</script>

<style scoped lang="scss">
.members .card {
  max-width: 150px;
}
.members .remove {
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: #fff;
  border-radius: 20px;
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.members .remove .icon {
  background-color: #666;
  mask-image: url('/remove.svg');
  text-decoration: none;
  color: #999;
  width: 13px;
  height: 13px;
  display: block;
  margin: 6px;
  &:hover {
    background-color: #333;
  }
}
</style>
