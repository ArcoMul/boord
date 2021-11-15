<template>
  <b-container>
    <b-row>
      <b-col md="10" lg="8" xl="6" class="pt-6">
        <div class="title">
          <b-link class="back" to="/">&larr;</b-link>
          <h1>Activity</h1>
        </div>
        <div
          v-for="card in cards"
          :key="card._id"
          class="d-flex justify-content-between text-white pb-2"
        >
          <span>{{ card.title }}</span
          ><span>{{ card.updated }}</span>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const { data: cards } = await $axios.get('/api/cards/last-updated')
    return {
      cards
    }
  }
}
</script>
