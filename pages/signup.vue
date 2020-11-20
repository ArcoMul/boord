<template>
  <section class="container" id="page-signup">
    <b-row class="justify-content-sm-center">
      <b-col lg="5" xl="4">
        <SignupForm title="BOORD" subtitle="Get On Board"/>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import SignupForm from '../components/SignupForm.vue'

export default {
  components: {
    SignupForm
  },
  head() {
    return {
      title: 'BOORD | Aanmelden'
    }
  }
}
</script>

<style lang="scss">
@import '../assets/style/variables.scss';

#page-signup {
  padding-top: 50px;
  padding-bottom: 50px;
  h1,
  .or {
    color: $gray-900;
  }
  h2 {
    text-align: center;
    font-size: 20px;
    margin-bottom: 26px;
  }
}
</style>
