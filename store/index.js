import { debounce } from 'lodash'
import Vue from 'vue'
import socket from '../lib/socket.io'

function updateCard(url, _card) {
  socket(url).emit('updateCard', _card)
}
const updateCardDebounced = debounce(updateCard, 1000)

function updateBoard(url, board) {
  socket(url).emit('updateBoard', { board })
}
const updateBoardDebounced = debounce(updateBoard, 100)

export const state = () => ({
  user: null,
  config: {},
  board: {},
  members: [],
  cards: [],
  collapsedSections: []
})

export const mutations = {
  setBoard(state, { board }) {
    state.board = board
  },
  setMembers(state, { members }) {
    state.members = members
  },
  setCards(state, { cards }) {
    state.cards = cards
  },
  updateSections(state, { sections }) {
    state.board.sections = sections
  },
  updateSection(state, { section }) {
    state.board.sections = state.board.sections.map(s =>
      s.id === section.id ? section : s
    )
  },
  updateBoard(state, props) {
    state.board = Object.assign(state.board, props)
  },
  updateCard(state, { card }) {
    state.cards = state.cards.map(t => (t._id === card._id ? card : t))
  },
  moveCard(
    state,
    { sectionId, columnIndex, removedIndex, addedIndex, cardId }
  ) {
    const sectionIndex = state.board.sections.findIndex(s => s.id === sectionId)
    const cards = [...state.board.sections[sectionIndex].cards[columnIndex]]
    if (removedIndex !== null) {
      cards.splice(removedIndex, 1)
    }
    if (addedIndex !== null) {
      cards.splice(addedIndex, 0, cardId)
    }
    Vue.set(state.board.sections[sectionIndex].cards, columnIndex, cards)
  },
  updateSectionName(state, { id, name }) {
    state.board.sections.forEach(section => {
      if (section.id === id) {
        section.name = name
      }
    })
  },
  addCard(state, { section, card }) {
    state.cards.push(card)
    state.board.sections.forEach(s => {
      if (s.id === section.id) {
        s.cards[0].push(card._id)
      }
    })
  },
  addSection(state, { section }) {
    state.board.sections.push(section)
  },
  collapseSection(state, { isCollapsed, sectionId }) {
    if (isCollapsed) {
      state.collapsedSections.push(sectionId)
    } else {
      state.collapsedSections = state.collapsedSections.filter(
        s => s !== sectionId
      )
    }
  },
  SET_USER(_state, user) {
    _state.user = user
  },
  SET_CONFIG(_state, config) {
    _state.config = config
  },
  SOCKET_ADDCARD(state, card) {
    state.cards.push(card)
  },
  SOCKET_UPDATECARD(state, card) {
    state.cards = state.cards.map(t => (t._id === card._id ? card : t))
  },
  SOCKET_REMOVECARD(state, { board, card }) {
    state.board = board
    state.cards = state.cards.filter(c => c._id !== card._id)
  },
  SOCKET_UPDATEBOARD(state, board) {
    state.board = board
  },
  SOCKET_UPDATEMEMBERS(state, members) {
    state.members = members
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    commit('SET_CONFIG', req.config)
    if (req.session && req.user) {
      commit('SET_USER', req.user)
    }
  },
  setBoard({ commit, state }, { board }) {
    commit('setBoard', { board })
  },
  setMembers({ commit, state }, { members }) {
    commit('setMembers', { members })
  },
  setCards({ commit, state }, { cards }) {
    commit('setCards', { cards })
  },
  updateSections({ commit, state }, { sections }) {
    commit('updateSections', { sections })
    // TODO: don't update the whole sections property here
    updateBoardDebounced(state.config.web.url, {
      _id: state.board._id,
      sections
    })
  },
  updateSection({ commit, state }, { section }) {
    commit('updateSection', { section })
    // TODO: don't update the whole sections property here
    updateBoardDebounced(state.config.web.url, {
      _id: state.board._id,
      sections: state.board.sections
    })
  },
  updateCard({ commit, state }, { card }) {
    commit('updateCard', { card })
    updateCardDebounced(state.config.web.url, card)
  },
  updateBoard({ commit, state }, board) {
    commit('updateBoard', board)
    updateBoardDebounced(state.config.web.url, {
      _id: state.board._id,
      ...board
    })
  },
  updateSectionName({ commit, state }, { id, name }) {
    commit('updateSectionName', { id, name })
    // TODO: don't update the whole sections property here
    updateBoardDebounced(state.config.web.url, {
      _id: state.board._id,
      sections: state.board.sections
    })
  },
  addCard({ commit, state }, { section, card }) {
    socket(state.config.web.url).emit('addCard', {
      card,
      boardId: state.board._id,
      sectionId: section.id
    })
  },
  removeCard({ commit, state }, { card }) {
    socket(state.config.web.url).emit('removeCard', {
      card,
      boardId: state.board._id
    })
  },
  removeSection({ commit, state }, { section }) {
    socket(state.config.web.url).emit('removeSection', {
      sectionId: section.id,
      boardId: state.board._id
    })
  },
  addSection({ commit, state }, { name }) {
    socket(state.config.web.url).emit('addSection', {
      boardId: state.board._id,
      section: { name }
    })
  },
  addBoardMember({ commit, state }, { email }) {
    socket(state.config.web.url).emit('addBoardMember', {
      boardId: state.board._id,
      email: email
    })
  },
  removeBoardMember({ commit, state }, { id }) {
    socket(state.config.web.url).emit('removeBoardMember', {
      boardId: state.board._id,
      userId: id
    })
  },
  moveCard(
    { commit, state },
    { sectionId, columnIndex, removedIndex, addedIndex, cardId }
  ) {
    commit('moveCard', {
      sectionId,
      columnIndex,
      removedIndex,
      addedIndex,
      cardId
    })
    socket(state.config.web.url).emit('moveCard', {
      boardId: state.board._id,
      sectionId,
      columnIndex,
      removedIndex,
      addedIndex,
      cardId
    })
  },
  async login({ commit }, { req, email, password }) {
    try {
      const { data: user } = await this.$axios.post('/auth/login', {
        email,
        password
      })
      commit('SET_USER', user)
    } catch (err) {
      const {
        response: { data }
      } = err

      if (!data) {
        throw err
      }

      if (data.error === 'unknown user') {
        throw new Error('unknown user')
      } else if (data.error === 'incorrect password') {
        throw new Error('incorrect password')
      } else {
        throw new Error('unknown error')
      }
    }
  },
  async signup({ commit }, { req, name, email, password, invitationCode }) {
    try {
      const { data: user } = await this.$axios.post('/auth/signup', {
        name,
        email,
        password,
        invitationCode
      })
      commit('SET_USER', user)
    } catch (err) {
      const {
        response: { data }
      } = err

      if (data && data.error) {
        throw new Error(data.error)
      } else {
        throw err
      }
    }
  }
}

export const getters = {
  cardsMap(state, getters) {
    return state.cards.reduce((acc, val) => {
      acc[val._id] = val
      return acc
    }, {})
  },
  membersMap(state, getters) {
    return state.members.reduce((acc, val) => {
      acc[val._id] = val
      return acc
    }, {})
  }
}
