import Vue from 'vue'
import VueSocketIO from 'vue-socket.io-extended'
import socket from '../lib/socket.io'

export default ({ store }) => {
  Vue.use(VueSocketIO, socket(store.state.config.web.url), { store })
}
