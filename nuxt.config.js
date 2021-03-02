const pkg = require('./package')

module.exports = {
  // Modules aren't watched by default
  watch: ['~/modules/server/**/*.js'],

  /*
   ** Headers of the page
   */
  head: {
    title: 'Boord',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/main.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    {
      src: '~/plugins/socket.io.js',
      ssr: false
    },
    { src: '~/plugins/localStorage.js', ssr: false },
    { src: '~/plugins/click-outside.js', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '~/modules/server'
  ],

  axios: {
    // See: https://axios.nuxtjs.org/options
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_BASE_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.BASE_URL
    }
  },

  /*
   ** Router
   */
  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'Card Modal',
        path: '/b/:slug/c/:cardId',
        component: resolve(__dirname, 'pages/b/_slug.vue')
      })
      routes.push({
        name: 'Section Modal',
        path: '/b/:slug/s/:sectionId',
        component: resolve(__dirname, 'pages/b/_slug.vue')
      })
      routes.push({
        name: 'Board Modal',
        path: '/b/:slug/info',
        component: resolve(__dirname, 'pages/b/_slug.vue')
      })
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  }
}
