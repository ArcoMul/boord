<template>
  <b-container fluid class="board-page-container">
    <b-row>
      <b-col>
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
            <b-col>
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
            </b-col>
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
      </b-col>
    </b-row>
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

<style lang="scss" scoped>
.board-page-container {
  padding-left: 30px;
  padding-right: 30px;
}

.title {
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
    line-height: 0;
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
}

.add-section-row {
  margin-bottom: 2rem;
}

.section-button {
  display: inline-block;
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
