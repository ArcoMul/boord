<template>
  <b-modal
    v-if="showModal"
    v-model="showModal"
    size="lg"
    hide-header
    hide-footer
    modal-class="board-modal"
    :key="card._id"
    @hide="onHide"
  >
    <b-row>
      <b-col>
        <Editable
          tag="h2"
          spellcheck
          placeholder="Enter a card title..."
          :content="card.title"
          :close-on-break="true"
          @update="updateCardTitle(card, $event)"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="8">
        <CardLabelSelector
          :labels="board.labels"
          :selected="card.labels"
          class="mb-3"
        />
        <EditableMarkdown
          tag="p"
          class="markdown"
          spellcheck
          placeholder="Enter a card description..."
          :content="card.text"
          @update="updateCardText(card, $event)"
        />
      </b-col>
      <b-col cols="4">
        <div class="points">
          <h3>Points</h3>
          <PointsInput
            class="points-input"
            :value="card.points"
            @update="updateCardPoints(card, $event)"
          />
        </div>
        <div class="members">
          <h3>Members</h3>
          <UserCircles
            :users="members"
            @onRemove="member => onRemoveMember(card, member._id)"
          />
          <b-select
            v-model="addMemberSelected"
            :options="boardMemberOptions"
            @input="onAddMember(card)"
          />
          <b-button
            v-if="!card.members.includes('' + $store.state.user._id)"
            class="add-myself-button"
            @click="() => addMember(card, '' + $store.state.user._id)"
          >Add myself</b-button>
          <b-button
            v-else
            class="add-myself-button"
            @click="() => onRemoveMember(card, '' + $store.state.user._id)"
          >Remove myself</b-button>
        </div>
        <hr />
        <confirm-link
          tag="div"
          title="Remove card"
          :message="`Are you sure you want to remove the card '${card.title}'`"
          @confirm="() => removeCard(card)"
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
import PointsInput from '~/components/PointsInput.vue'
import ConfirmLink from '~/components/ConfirmLink.vue'
import Modal from '~/components/mixins/Modal'
import UserCircles from '~/components/UserCircles.vue'
import CardLabelSelector from '~/components/CardLabelSelector.vue'

export default {
  mixins: [Modal],
  components: {
    Editable,
    EditableMarkdown,
    PointsInput,
    ConfirmLink,
    UserCircles,
    CardLabelSelector
  },
  props: {
    cardId: {
      type: String
    }
  },
  data() {
    // Convert all known users in this board to an options array
    let boardMemberOptions = this.$store.state.members.map(member => ({
      value: member._id,
      text: member.name
    }))
    // Only show the ones which are still member of the board
    boardMemberOptions = boardMemberOptions.filter(option =>
      this.$store.state.board.members.includes(option.value)
    )
    // Add a default option explaining the action
    boardMemberOptions.unshift({
      value: null,
      text: 'Add member',
      disabled: true
    })

    return {
      showModal: !!this.cardId,
      addMemberSelected: null,
      boardMemberOptions
    }
  },
  computed: {
    card() {
      return this.$store.getters.cardsMap[this.cardId]
    },
    members() {
      return this.card.members.map(id => this.$store.getters.membersMap[id])
    },
    board() {
      return this.$store.state.board
    }
  },
  watch: {
    cardId() {
      this.showModal = !!this.cardId
    }
  },
  methods: {
    updateCardTitle(_card, $event) {
      const card = Object.assign({}, _card)
      card.title = $event
      this.$store.dispatch('updateCard', { card })
    },
    updateCardText(_card, $event) {
      const card = Object.assign({}, _card)
      card.text = $event
      this.$store.dispatch('updateCard', { card })
    },
    updateCardPoints(_card, $event) {
      const card = Object.assign({}, _card)
      card.points = Number($event)
      this.$store.dispatch('updateCard', { card })
    },
    removeCard(_card) {
      const card = Object.assign({}, _card)
      this.$store.dispatch('removeCard', { card })
      this.close()
    },
    onAddMember(_card) {
      this.addMember(_card, this.addMemberSelected)
      this.addMemberSelected = null
    },
    addMember(_card, member) {
      const card = Object.assign({}, _card)
      const members = [...card.members]
      members.push(member)
      card.members = members
      this.$store.dispatch('updateCard', { card })
    },
    onRemoveMember(_card, memberId) {
      const card = Object.assign({}, _card)
      card.members = card.members.filter(id => id !== memberId)
      this.$store.dispatch('updateCard', { card })
    }
  }
}
</script>

<style scoped lang="scss">
.points {
  margin-bottom: 30px;
}
.add-myself-button {
  width: 100%;
  margin-top: 15px;
}
</style>