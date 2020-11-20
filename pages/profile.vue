<template>
  <b-container>
    <b-row align-h="center">
      <b-col cols="8">
        <div class="title">
          <b-link class="back" to="/">&larr;</b-link>
          <h1>Profile - {{ $store.state.user.name }}</h1>
        </div>
        <b-card style="margin-top: 30px">
          <p>
            E-mail: {{ $store.state.user.email || 'None' }}
            <br>
            <br>This is your profile, but there is nothing to show yet. Haha!
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BoardSection from '~/components/BoardSection.vue'
import Editable from '~/components/Editable.vue'
import PointsInput from '~/components/PointsInput.vue'

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
