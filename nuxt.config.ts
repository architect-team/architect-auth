import colors from 'vuetify/es5/util/colors';

const config = {
  srcDir: './src/',

  server: {
    host: '0.0.0.0',
  },

  serverMiddleware: [
    '~/server-middleware/session',
    { path: '/oauth2/consent', handler: '~/server-middleware/body-parser' },
  ],

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: `%s - ${process.env.NUXT_ENV_APP_NAME}`,
    title: process.env.NUXT_ENV_APP_NAME,
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',

    '@nuxtjs/proxy',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: false,
    theme: {
      themes: {
        light: {
          primary: process.env.THEME_PRIMARY_COLOR || '#2ca85e',
          accent: colors.grey.darken3,
          secondary: '#121E34',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: '#2ca85e',
          background: '#EFF3F9',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  // Proxy Configuration: https://www.npmjs.com/package/@nuxtjs/proxy
  proxy: {
    '/self-service': process.env.KRATOS_PUBLIC_URL,
    '/schemas': process.env.KRATOS_PUBLIC_URL,
    '/sessions': process.env.KRATOS_PUBLIC_URL,

    '/.well-known': process.env.HYDRA_PUBLIC_URL,
    '/oauth2/auth': process.env.HYDRA_PUBLIC_URL,
    '/oauth2/token': process.env.HYDRA_PUBLIC_URL,
    '/oauth2/revoke': process.env.HYDRA_PUBLIC_URL,
    '/oauth2/sessions': process.env.HYDRA_PUBLIC_URL,
    '/userinfo': process.env.HYDRA_PUBLIC_URL,
  },
};

export default config;
