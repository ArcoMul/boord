<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="8">
        <div class="title">
          <b-link class="back" to="/">&larr;</b-link>
          <h1>Profile - {{ $store.state.user.name }}</h1>
        </div>
        <b-card class="mt-3">
          <p class="m-0">
            E-mail: {{ $store.state.user.email || 'None' }}<br />
            <br />
            This is your profile, but there is nothing to show yet. Haha!
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  middleware: 'auth',
  components: {},
  head() {
    return {
      title: 'Profile | Boord'
    }
  }
}
</script>
