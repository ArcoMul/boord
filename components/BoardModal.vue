<template>
  <b-modal
    v-if="showModal"
    v-model="showModal"
    size="lg"
    hide-header
    hide-footer
    class="board-modal"
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
      <b-col cols="12">
        <EditableMarkdown
          tag="p"
          class="markdown"
          spellcheck
          placeholder="Enter a board description..."
          :content="board.text"
          @update="updateBoardText($event)"
        />
        <hr />

        <div class="members">
          <h2>Members</h2>
          <b-card-group v-if="board.members.length > 0">
            <b-card
              v-for="member in members.filter(m => board.members.includes(m._id.toString()))"
              :key="member._id"
              :img-src="member.avatar"
            >
              {{ member.name }}
              <span class="remove" @click="() => onRemoveMember(member._id)">
                <span class="icon"></span>
              </span>
            </b-card>
          </b-card-group>
          <i v-else>No members yet</i>
          <b-form @submit.prevent="onAddMember">
            <b-input-group prepend="Add member" class="mt-3">
              <b-form-input v-model="newMember" list="member-name-list" autocomplete="off"></b-form-input>
              <b-input-group-append>
                <b-button type="submit" variant="info">Add</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form>
          <datalist id="member-name-list">
            <option v-for="user in users" :key="user.email" :value="user.email">{{ user.name }}</option>
          </datalist>
        </div>
      </b-col>
    </b-row>
  </b-modal>
</template>

<script>
import Editable from '~/components/Editable.vue'
import EditableMarkdown from '~/components/EditableMarkdown.vue'
import PointsInput from '~/components/PointsInput.vue'
import ConfirmLink from '~/components/ConfirmLink.vue'
import Modal from '~/components/mixins/Modal'

export default {
  mixins: [Modal],
  components: {
    Editable,
    EditableMarkdown,
    PointsInput,
    ConfirmLink
  },
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
  async created() {
    if (!this.board.text) {
      this.board.text = ''
    }
    this.users = await this.$axios.$get('/api/users')
  },
  computed: {
    board() {
      return this.$store.state.board
    },
    members() {
      return this.$store.state.members
    }
  },
  watch: {
    show() {
      this.showModal = this.show
    }
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
      console.log('remove')
      this.$store.dispatch('removeBoardMember', { id: $event })
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
