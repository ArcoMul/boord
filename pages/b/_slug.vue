<template>
  <b-container fluid>
    <div class="title">
      <b-link class="back" to="/">&larr;</b-link>
      <Editable
        tag="h1"
        :content="$store.state.board.name"
        close-on-break
        @update="updateBoardName"
      />
      <span class="button-board-info" @click="onBoardInfo">i</span>
      <div class="avatars">
        <img
          v-for="member in $store.state.members.filter((m) =>
            board.members.includes(m._id.toString())
          )"
          :key="member._id"
          :src="member.avatar"
          :title="member.name"
          class="avatar"
        />
      </div>
    </div>
    <div class="board">
      <Container
        group-name="section"
        :get-child-payload="(index) => getSectionPayload(index)"
        drag-handle-selector=".section-drag-handle"
        @drop="(r) => onDrop(r)"
      >
        <Draggable
          v-for="(section, sectionIndex) in $store.state.board.sections"
          :key="section.id"
        >
          <BoardSection
            v-if="!section.deleted"
            :section="section"
            :columns="$store.state.board.columns"
            @update="(section) => onSectionUpdate(sectionIndex, section)"
            @cardClick="onCardClick"
            @sectionInfo="onSectionInfo"
            @moveCard="onMoveCard"
          />
        </Draggable>
      </Container>
      <b-row class="add-section-row">
        <Editable
          v-if="isAddingSection"
          tag="h2"
          class="section-title"
          focus
          :content="addSectionTitle"
          @update="addSectionTitle = $event"
          @submit="addSection"
          @blur="isAddingSection = false"
        />
        <div
          v-else
          class="section-button"
          @click="
            addSectionTitle = ''
            isAddingSection = true
          "
        >
          + Add another section
        </div>
      </b-row>
    </div>

    <CardModal
      ref="CardModal"
      :card-id="cardModal.cardId"
      @close="onCloseCardModal"
    />
    <SectionModal
      ref="SectionModal"
      :section-id="sectionModal.sectionId"
      @close="onCloseSectionModal"
    />
    <BoardModal
      ref="BoardModal"
      :show="openBoardModal"
      @close="onCloseBoardModal"
    />
    <p class="text-white">hm: {{ openBoardModal }}</p>
    <p class="text-white">route: {{ route }}</p>
  </b-container>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import BoardSection from '~/components/BoardSection.vue'
import Editable from '~/components/Editable.vue'
import CardModal from '~/components/CardModal.vue'
import SectionModal from '~/components/SectionModal.vue'
import BoardModal from '~/components/BoardModal.vue'
import socket from '~/lib/socket.io'

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return arr

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

export default {
  middleware: 'auth',
  key: '/b/_slug',
  scrollToTop: false,
  components: {
    Container,
    Draggable,
    BoardSection,
    Editable,
    CardModal,
    SectionModal,
    BoardModal,
  },
  async asyncData({
    $axios,
    store,
    route,
    params: { slug, cardId, sectionId },
  }) {
    // We're navigating back and forth when opening modals, only fetch board
    // and cards when it's actually needed
    if (store.state.board.slug !== slug) {
      const { board, cards, members } = await $axios.$get('/api/boards/' + slug)
      store.dispatch('setBoard', { board })
      store.dispatch('setCards', { cards })
      store.dispatch('setMembers', { members })
    }

    let openBoardModal = false
    if (route.fullPath.split('/').splice(-1, 1)[0] === 'info') {
      openBoardModal = true
    }

    return {
      slug,
      cardModal: {
        cardId,
      },
      sectionModal: {
        sectionId,
      },
      openBoardModal,
    }
  },
  created() {
    socket(this.$store.state.config.web.url).emit('joinRoom', {
      name: `board-${this.$store.state.board._id}`,
    })
  },
  data() {
    return {
      isAddingSection: false,
      addSectionTitle: '',
      cardModal: {
        cardId: this.cardId || null,
      },
      sectionModal: {
        sectionId: this.sectionId || null,
      },
      openBoardModal: false,
      route: null,
    }
  },
  head() {
    return {
      title: this.$store.state.board.name + ' | Boord',
    }
  },
  computed: {
    board() {
      return this.$store.state.board
    },
  },
  methods: {
    getSectionPayload(sectionIndex) {
      return this.$store.state.board.sections[sectionIndex]
    },
    onDrop(dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult
      if (removedIndex === null && addedIndex === null) {
        return
      }
      let sections = [...this.$store.state.board.sections]
      sections = applyDrag(sections, dropResult)
      this.$store.dispatch('updateSections', { sections })
    },
    onSectionUpdate(sectionIndex, section) {
      this.$store.dispatch('updateSection', { section })
    },
    onCardClick(card) {
      this.cardModal.cardId = card._id
      this.$router.push(`/b/${this.slug}/c/${card._id}`)
    },
    onCloseCardModal() {
      this.cardModal.cardId = null
      this.$router.push(`/b/${this.slug}`)
    },
    onSectionInfo(section) {
      this.sectionModal.sectionId = section.id
      this.$router.push(`/b/${this.slug}/s/${this.sectionModal.sectionId}`)
    },
    onCloseSectionModal() {
      this.sectionModal.sectionId = null
      this.$router.push(`/b/${this.slug}`)
    },
    onBoardInfo(section) {
      this.openBoardModal = true
      this.$router.push(`/b/${this.slug}/info`)
    },
    onCloseBoardModal() {
      this.openBoardModal = false
      this.$router.push(`/b/${this.slug}`)
    },
    onMoveCard({ sectionId, columnIndex, removedIndex, addedIndex, cardId }) {
      this.$store.dispatch('moveCard', {
        sectionId,
        columnIndex,
        removedIndex,
        addedIndex,
        cardId,
      })
    },
    updateBoardName($event) {
      this.$store.dispatch('updateBoard', { name: $event })
    },
    async addSection() {
      await this.$store.dispatch('addSection', {
        name: this.addSectionTitle,
      })
      this.addSectionTitle = ''
      this.isAddingSection = false
    },
  },
}
</script>

<style lang="scss">
.board > .smooth-dnd-container {
  flex: 0 !important;
}

.title {
  display: flex;
  margin-top: 30px;
  padding-left: 15px;
  a.back {
    flex: 0 0 30px;
    color: #fff;
    font-size: 24px;
    margin: 0;
    line-height: 1.2;
    &:hover {
      text-decoration: none;
    }
  }
  h1 {
    display: inline-block;
    min-width: 10px;
    margin: 0;
    outline: 0;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    padding-right: 15px;
  }
  .button-board-info {
    flex: 0 0 25px;
    border-radius: 100%;
    color: #eee;
    text-align: center;
    height: 25px;
    margin-top: 4px;
    border: 1px solid #6c6c6c;
    font-weight: bold;
    font-size: 14px;
    &:hover {
      background-color: #444;
      cursor: pointer;
    }
  }
  .avatars {
    margin-top: 4px;
    margin-left: 5px;
    .avatar {
      width: 25px;
      height: 25px;
      border-radius: 25px;
      margin-left: -5px;
      &:first-child {
        margin: 0;
      }
    }
  }
}

.board {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
}

.row {
  padding: 0 30px;
}

.board-section {
  margin-top: 15px;
  margin-bottom: 15px;
  .board-col {
    // background-color: rgb(170, 170, 170);
  }
}

.section-title {
  min-width: 10px;
  color: #eee;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 11px;
  display: inline-block;
  outline: 0;
}

.board-col {
  margin: 0 5px;
  flex-grow: 1;
  flex-basis: 0;
  padding: 5px;
  background-color: #ccc;
  border-radius: 2px;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  position: relative;
  max-height: 60vh;
  overflow-y: auto;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  &.start-col {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    div {
      width: 100%;
      font-weight: bold;
    }
  }
  &.col-top {
    border-radius: 5px 5px 0 0;
    border: 0;
  }
  &.col-bottom {
    height: 30px;
    border-radius: 0 0 5px 5px;
  }
  &.col-middle {
    border: 0;
  }
  .smooth-dnd-container {
    max-height: 60vh;
    overflow-y: auto;
    scrollbar-width: thin;
    padding: 0 2px 0 2px;
    scrollbar-color: #aaa #ccc;

    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: #ccc;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #aaa;
    }
  }
  h2 {
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    line-height: 18px;
    padding: 5px 0 11px 5px;
    color: #777;
  }
}

.smooth-dnd-container {
  flex: 2;
}

.bcard {
  position: relative;
  padding: 5px 7px 5px 7px;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 5px;
  cursor: pointer;
  width: 100%;
  &:last-child {
    margin: 0;
  }
  & > div {
    min-height: 23px;
  }
  .bcard-title {
    padding-right: 7px;
  }
  .points {
    position: absolute;
    right: 11px;
    top: 5px;
    color: #999;
  }
  .extras {
    height: 23px;
    display: flex;
    .description {
      margin-top: 6px;
      margin-right: 5px;
      background-color: #999;
      mask-image: url('/description.svg');
      width: 15px;
      height: 13px;
      display: block;
    }
    .members img {
      width: 23px;
      height: 23px;
      border-radius: 23px;
      margin-right: 5px;
    }
  }
}

.add-section-row {
  margin-top: 30px;
  margin-bottom: 30px;
}

.section-button {
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.07);
  &:hover {
    color: rgba(255, 255, 255, 1);
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
