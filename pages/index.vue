<template>
  <b-container>
    <b-row class="title-row">
      <b-col>
        <h1>Boards</h1>
      </b-col>
    </b-row>
    <BoardOverview
      :boards="boards.filter(b => b.members.includes(user._id.toString()))"
      :create-new-board="true"
      @removeBoard="(id) => removeBoard(id)"
      @addBoard="showCreateBoardModal = true"
    />
    <b-row>
      <b-col class="title-row">
        <h2>Other boards</h2>
      </b-col>
    </b-row>
    <BoardOverview
      :boards="boards.filter(b => !b.members.includes(user._id.toString()))"
      @removeBoard="(id) => removeBoard(id)"
    />
    <!-- Create new board modal -->
    <b-modal v-model="showCreateBoardModal" title="Create new board" hide-footer>
      <b-form @submit.prevent="onNewBoardSubmit">
        <b-form-group label="Name" label-for="name-input">
          <b-form-input
            id="name-input"
            v-model="newBoardName"
            type="text"
            required
            placeholder="Enter board name..."
          ></b-form-input>
        </b-form-group>
        <b-button class="float-right" type="submit" variant="primary">Create</b-button>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
import BoardSection from '~/components/BoardSection.vue'
import Editable from '~/components/Editable.vue'
import PointsInput from '~/components/PointsInput.vue'
import ConfirmLink from '~/components/ConfirmLink.vue'
import BoardOverview from '~/components/BoardOverview.vue'

export default {
  middleware: 'auth',
  components: { ConfirmLink, BoardOverview },
  async asyncData({ $axios, store }) {
    const { data: boards } = await $axios.get('/api/boards')
    return {
      boards: boards,
      user: store.state.user
    }
  },
  data() {
    return {
      showCreateBoardModal: false,
      newBoardName: ''
    }
  },
  head() {
    return {
      title: 'Boord'
    }
  },
  methods: {
    async onNewBoardSubmit() {
      const { board } = await this.$axios.$post('/api/boards', {
        name: this.newBoardName
      })
      this.$router.push(`/b/${board.slug}`)
      this.newBoardName = ''
    },
    async removeBoard(id) {
      await this.$axios.$delete(`/api/boards/${id}`)
      const { data: boards } = await this.$axios.get('/api/boards')
      this.boards = boards
    }
  }
}
</script>

<style lang="scss" scoped>
.title-row {
  margin-top: 60px;
  h1 {
    color: #fff;
    font-weight: bold;
    font-size: 32px;
    margin-bottom: 60px;
    padding-bottom: 15px;
    padding-right: 60px;
    border-bottom: 2px solid #fff;
    display: inline-block;
  }
  h2 {
    color: #dadada;
    font-weight: bold;
    font-size: 22px;
    margin-bottom: 30px;
    padding-bottom: 10px;
    padding-right: 45px;
    border-bottom: 2px solid #dadada;
    display: inline-block;
  }
}
.add-tile {
  background-color: #cbccccb0;
  &:hover {
    background-color: #ccc;
  }
}
</style>