<template>
  <b-row class="boards mx-n2">
    <b-col
      v-for="board in boards"
      :key="board._id"
      cols="4"
      md="3"
      lg="2"
      class="px-2"
    >
      <b-link class="board-tile mb-3" :to="`/b/${board.slug}`">
        <span>{{ board.name }}</span>
        <confirm-link
          tag="b-link"
          class="remove"
          title="Remove board"
          :message="`Are you sure you want to remove the board ${board.name}`"
          @confirm="() => $emit('removeBoard', board._id)"
        ></confirm-link>
      </b-link>
    </b-col>
    <b-col v-if="createNewBoard" cols="4" md="3" lg="2" class="px-2">
      <b-link
        class="board-tile add-tile outline"
        @click="() => $emit('addBoard')"
      >
        Create new<br />board...
      </b-link>
    </b-col>
  </b-row>
</template>

<script>
import ConfirmLink from '~/components/ConfirmLink.vue'

export default {
  components: { ConfirmLink },
  props: {
    boards: Array,
    createNewBoard: Boolean
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.board-tile {
  display: block;
  background-color: #ccc;
  height: 100px;
  border-radius: 3px;
  padding: 15px;
  color: #333;
  font-weight: bold;
  position: relative;
  &:hover {
    text-decoration: none;
    background-color: #bbb;
    .remove {
      display: block;
    }
  }
  &.outline {
    padding: 14px;
    background-color: transparent;
    border: 1px solid #fff;
    color: #fff;
    &:hover {
      padding: 15px;
      color: #333;
      background-color: #bbb;
      border: 0;
    }
  }
  .remove {
    background-color: #666;
    mask-image: url('/remove.svg');
    text-decoration: none;
    display: none;
    position: absolute;
    right: 5px;
    top: 5px;
    color: #999;
    width: 13px;
    height: 13px;
    &:hover {
      background-color: #333;
    }
  }
}
</style>
