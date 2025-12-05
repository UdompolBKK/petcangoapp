// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-07WH2LRYHD',
          async: true
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-07WH2LRYHD');
          `
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/common/logodog-min-1.png' }
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
    '~/assets/scss/main.scss'
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/scss/_variables.scss"; @import "~/assets/scss/_mixins.scss";'
        }
      }
    }
  },

  runtimeConfig: {
    // Private keys (server-side only)
    firebaseAdminProjectId: '',
    firebaseAdminClientEmail: '',
    firebaseAdminPrivateKey: '',

    // SMTP Configuration
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',

    // Public keys (exposed to client)
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: ''
    }
  }
})
