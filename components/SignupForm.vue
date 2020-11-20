<template>
  <b-card>
    <h1>{{ title }}</h1>
    <h2 v-if="subtitle">{{ subtitle }}</h2>

    <b-alert variant="danger" :show="!!error" dismissible>{{ error }}</b-alert>

    <div v-if="methods.includes('slack')">
      <a class="d-block text-center" :href="`/auth/slack?from_url=${$route.query.from_url}`">
        <img src="https://api.slack.com/img/sign_in_with_slack.png">
      </a>
    </div>

    <div v-if="methods.includes('username-password')">
      <div v-if="methods.length > 1" class="or">
        <span>of</span>
      </div>
      <b-form @submit.prevent="onUsernamePasswordSubmit">
        <b-form-group>
          <b-input type="text" v-model="name" placeholder="Naam"/>
        </b-form-group>
        <b-form-group>
          <b-input type="email" v-model="email" placeholder="E-mail"/>
        </b-form-group>
        <b-form-group>
          <b-input type="password" v-model="password" placeholder="Wachtwoord"/>
        </b-form-group>
        <b-button variant="primary" type="submit" block>Aanmelden</b-button>
      </b-form>
    </div>

    <div v-if="allowSignup">
      <div class="or">
        <span>of</span>
      </div>
      <b-link to="/login" class="login">Al een account? Inloggen</b-link>
    </div>
  </b-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    methods: {
      type: Array,
      default() {
        return ['slack', 'username-password']
      }
    },
    allowSignup: {
      type: Boolean,
      default: true
    },
    invitationCode: {
      type: String
    },
    userName: {
      type: String
    }
  },
  data() {
    return {
      name: this.userName || '',
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    onUsernamePasswordSubmit() {
      if (!this.name) {
        this.error = 'Vul een naam in'
        return
      }
      if (!this.email) {
        this.error = 'Vul een email adres in'
        return
      }
      if (!this.password) {
        this.error = 'Vul een wachtwoord in'
        return
      }
      this.signup(this.email, this.password, {
        name: this.name,
        invitationCode: this.invitationCode
      })
    },
    async signup(email, password, { name, invitationCode }) {
      try {
        await this.$store.dispatch('signup', {
          name,
          email,
          password,
          invitationCode
        })
        this.$router.push('/')
      } catch (err) {
        if (err.message === 'email in use') {
          this.error = 'Dit email adres is al in gebruik'
        } else {
          this.error =
            'Inloggen mislukt, probeer het nogmaals of neem contact op met info@yipp.nl'
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/variables.scss';

h1 {
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
}

.or {
  position: relative;
  text-align: center;
  margin-bottom: 15px;
  margin-top: 10px;
  span {
    background-color: #fff;
    font-size: 12px;
    position: relative;
    z-index: 2;
    padding: 0 5px;
    color: $gray-600;
  }
  &:after {
    content: '';
    width: 100%;
    height: 1px;
    display: block;
    position: absolute;
    bottom: 9px;
    background-color: $gray-600;
  }
}

a.login {
  display: block;
  text-align: center;
  color: $link-color;
  font-size: 13px;
  &:hover {
    text-decoration: underline;
  }
}
</style>
