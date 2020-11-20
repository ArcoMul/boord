<template>
  <section class="container" id="page-login">
    <b-row class="justify-content-sm-center">
      <b-col lg="5" xl="4">
        <LoginForm title="BOORD" subtitle="Get On Board" :allowSignup="true"/>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import LoginForm from '../components/LoginForm.vue'

export default {
  components: {
    LoginForm
  },
  head() {
    return {
      title: 'Boord | Inloggen'
    }
  }
}
</script>

<style lang="scss">
@import '../assets/style/variables.scss';

#page-login {
  padding-top: 50px;
  padding-bottom: 50px;
  h1,
  .or {
    color: $gray-900;
  }
  h2 {
    font-size: 20px;
    margin-bottom: 26px;
    text-align: center;
  }
}
</style>
