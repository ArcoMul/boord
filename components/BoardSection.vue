<template>
  <div :class="{ 'board-section': true, 'toggled': toggled }">
    <b-row>
      <b-col>
        <div class="section-drag-handle"></div>
        <Editable
          tag="h2"
          :content="section.name"
          class="section-title"
          close-on-break
          @update="updateSectionName"
        />
        <span class="section-title title-border points">
          <span class="done">{{donePoints}}</span> /
          <span class="total">{{totalPoints}}</span>
        </span>
        <span
          :class="{ 'section-title': true, 'title-border': true, 'info': true, 'force-visible': section.text && section.text !== '' && section.text !== '\n' }"
          @click="$emit('sectionInfo', section)"
        >i</span>
        <span
          :class="{ 'section-title': true, 'title-border': true, 'info': true, 'toggle': true, 'force-visible': toggled, 'toggled': toggled }"
          @click="collapseSection()"
        >&nbsp;</span>
      </b-col>
    </b-row>
    <b-row>
      <b-col xl="10" class="col-container">
        <b-row class="mx-n1">
          <b-col
            v-for="(cards, columnIndex) in section.cards"
            :key="section.id + columnIndex"
            class="px-1"
          >
            <div class="board-col h-100">
              <h2>{{ columns[columnIndex].title }}</h2>
              <Container
                group-name="col"
                :get-child-payload="index => getCardPayload(columnIndex, index)"
                @drop="r => onDrop(columnIndex, r)"
              >
                <Draggable
                  v-for="card in getcards(cards)"
                  :key="section.id + columnIndex + card._id"
                  class="bcard card-bcard"
                >
                  <div @click="$emit('cardClick', card)">
                    <div class="title-row">
                      <div class="bcard-title">{{ card.title }}</div>
                      <span v-if="card.points" class="points">{{
                        card.points
                      }}</span>
                    </div>
                    <div
                      v-if="getTotalTodos(card.text) > 0"
                      class="todo-progress"
                    >
                      <div class="progressbar"><div class="fill" :style="{ width: (getDoneTodos(card.text)/getTotalTodos(card.text)*100)+'%' }"></div></div>
                      <div class="text">
                        {{ getDoneTodos(card.text) }}/{{ getTotalTodos(card.text) }}
                      </div>
                    </div>
                    <div
                      v-if="
                        card.text.trim() || (card.members && card.members.length > 0)
                      "
                      class="extras"
                    >
                      <span v-if="card.text.trim()" class="description"></span>
                      <span
                        v-if="card.members && card.members.length > 0"
                        class="members"
                      >
                        <img
                          v-for="member in card.members"
                          :key="member"
                          :src="$store.getters.membersMap[member].avatar"
                        />
                      </span>
                    </div>
                  </div>
                </Draggable>
              </Container>

              <!-- Add card -->
              <div
                v-if="columnIndex === 0 && isAddingCard"
                class="bcard add-card-card"
              >
                <Editable
                  class="add-card-editable"
                  :content="addCardTitle"
                  spellcheck
                  focus
                  @update="addCardTitle = $event"
                  @submit="addCard"
                  @blur="isAddingCard = false"
                />
              </div>
              <div
                v-else-if="columnIndex === 0"
                class="add-card"
                @click="isAddingCard = true"
              >
                + Add another card
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'
import Editable from '~/components/Editable.vue'

export default {
  components: {
    Container,
    Draggable,
    Editable
  },
  props: {
    section: Object,
    columns: Array
  },
  data() {
    return {
      isAddingCard: false,
      addCardTitle: ''
    }
  },
  computed: {
    totalPoints() {
      return this.section.cards.reduce(
        (acc, col) =>
          acc +
          col.reduce((acc, cardId) => {
            return (
              acc + (Number(this.$store.getters.cardsMap[cardId].points) || 0)
            )
          }, 0),
        0
      )
    },
    donePoints() {
      return this.section.cards[this.section.cards.length - 1].reduce(
        (acc, cardId) =>
          acc + Number(this.$store.getters.cardsMap[cardId].points) || 0,
        0
      )
    },
    toggled() {
      return this.$store.state.collapsedSections.includes(this.section.id)
    },
    getcards() {
      return cardIds => cardIds.map(id => this.$store.getters.cardsMap[id])
    }
  },
  methods: {
    async addCard() {
      await this.$store.dispatch('addCard', {
        section: this.section,
        card: { title: this.addCardTitle }
      })
      this.addCardTitle = ''
    },
    updateSectionName($event) {
      this.$store.dispatch('updateSectionName', {
        id: this.section.id,
        name: $event
      })
    },
    getCardPayload(columnIndex, cardIndex) {
      return this.section.cards[columnIndex][cardIndex]
    },
    onDrop(columnIndex, dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult
      if (removedIndex === null && addedIndex === null) {
        return
      }
      this.$emit('moveCard', {
        sectionId: this.section.id,
        columnIndex,
        removedIndex,
        addedIndex,
        cardId: payload
      })
    },
    collapseSection() {
      if (this.toggled) {
        this.$store.commit('collapseSection', {
          isCollapsed: false,
          sectionId: this.section.id
        })
      } else {
        this.$store.commit('collapseSection', {
          isCollapsed: true,
          sectionId: this.section.id
        })
      }
    },
    getTotalTodos(text) {
      return (text.match(/\- \[[x|\s]\]/gim) || []).length
    },
    getDoneTodos(text) {
      return (text.match(/\- \[[x]\]/gim) || []).length
    }
  }
}
</script>

<style lang="scss" scoped>
.board-section {
  margin-bottom: 2rem;
  &:hover {
    .section-drag-handle {
      visibility: visible;
    }
    .section-title.info {
      visibility: visible;
    }
  }
  &.toggled {
    overflow-y: hidden;
    height: 26px;
    overflow-x: hidden;
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

  &.title-border {
    border: 1px solid #6c6c6c;
    padding: 1px 10px;
    border-radius: 31px;
  }

  &.points {
    margin-left: 15px;
    color: #aaa;
    font-size: 14px;
    .done,
    .total {
      color: #ddd;
    }
  }

  &.info {
    width: 25px;
    padding: 1px 0px;
    text-align: center;
    margin-left: 7px;
    visibility: hidden;
    font-size: 14px;
    &:hover {
      background-color: #444;
      cursor: pointer;
    }
    &.toggle {
      mask-image: url(/cheveron-left.svg);
      background-color: #eee;
      transform: rotateZ(270deg);
      transition: transform 0.1s ease-in-out;
    }
    &.toggled {
      transform: rotateZ(180deg);
    }
    &.force-visible {
      visibility: visible;
    }
  }
}

@media (max-width: 768px)
{
  .col-container {
    overflow-x: scroll;
    padding: 0;
    margin: 0 -15px;
    width: calc(100% + 30px);
    & > .row {
      min-width: 1140px;
      & > .col:first-child {
        margin-left: 1rem;
      }
      & > .col:last-child {
        margin-right: 1rem;
      }
    }
  }
}

.bcard {
  position: relative;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 3px;
  margin-bottom: 5px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  .title-row {
    display: flex;
    margin-bottom: 0.2rem;
    justify-content: space-between;
    &:last-child {
      margin-bottom: 0rem;
    }
    .bcard-title {
      flex-grow: 1;
      margin-top: -4px;
      line-height: 1.333;
    }
    .points {
      margin-top: -4px;
      padding-left: 0.2rem;
      line-height: 1.333;
      color: #999;
    }
  }
  .todo-progress {
    width: 100%;
    padding-top: 0.1rem;
    margin-bottom: 0.3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .progressbar {
      margin-right: 0.5rem;
      width: 100%;
      height: 4px;
      background-color: #eee;
      flex-grow: 1;
      border-radius: 2px;
      overflow: hidden;
      .fill {
        height: 100%;
        background-color: #0ddd8f;
      }
    }
    .text {
      font-size: 0.7rem;
      line-height: 1;
      margin-top: -1.5px;
      color: #999;
    }
  }
  .extras {
    height: 20px;
    display: flex;
    line-height: 1;
    .description {
      margin-top: 3px;
      margin-right: 5px;
      background-color: #999;
      mask-image: url('/description.svg');
      width: 15px;
      height: 13px;
      display: block;
    }
    .members img {
      width: 20px;
      height: 20px;
      border-radius: 20px;
      margin-right: 5px;
    }
  }
}

.add-card {
  padding: 5.5px 7px;
  border-radius: 3px;
  margin-top: 5px;
  margin-left: 2px;
  margin-right: 2px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.5);
  &:hover {
    color: rgba(0, 0, 0, 1);
    background-color: rgba(0, 0, 0, 0.07);
  }
}

.add-card-card {
  margin-top: 5px !important;
  margin-left: 2px;
  margin-right: 2px;
}

.add-card-editable {
  min-height: 24px;
  display: block;
}

.section-drag-handle {
  visibility: hidden;
  background-size: contain;
  display: inline-block;
  vertical-align: middle;
  background-image: url(/draggable-handle.png);
  cursor: move;
  height: 19px;
  width: 8px;
  margin-top: -5px;
  margin-left: -10px;
  opacity: 0.5;
}
</style>
