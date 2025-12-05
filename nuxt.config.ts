// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'th'
      },
      title: 'PetCanGo - ค้นหาที่พักสัตว์เลี้ยงทั่วประเทศไทย',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงที่ใหญ่ที่สุดในประเทศไทย รวบรวมโรงแรมและรีสอร์ทที่รับสัตว์เลี้ยงกว่า 550+ แห่ง ครอบคลุม 77 จังหวัด พาน้องเที่ยว ไม่ต้องห่วง' },
        { name: 'keywords', content: 'ที่พักสัตว์เลี้ยง, โรงแรมหมาเข้าได้, รีสอร์ทพาหมาเข้าได้, pet friendly hotel thailand, ที่พักพาแมวเข้าได้, โรงแรมรับสัตว์เลี้ยง' },
        { name: 'author', content: 'PetCanGo' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'PetCanGo' },
        { property: 'og:locale', content: 'th_TH' },
        { property: 'og:title', content: 'PetCanGo - ค้นหาที่พักสัตว์เลี้ยงทั่วประเทศไทย' },
        { property: 'og:description', content: 'แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงที่ใหญ่ที่สุดในประเทศไทย รวบรวมโรงแรมและรีสอร์ทที่รับสัตว์เลี้ยงกว่า 550+ แห่ง' },
        { property: 'og:image', content: 'https://petcango.com/common/og-image.jpg' },
        { property: 'og:url', content: 'https://petcango.com' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'PetCanGo - ค้นหาที่พักสัตว์เลี้ยงทั่วประเทศไทย' },
        { name: 'twitter:description', content: 'แพลตฟอร์มค้นหาที่พักสัตว์เลี้ยงที่ใหญ่ที่สุดในประเทศไทย' },
        { name: 'twitter:image', content: 'https://petcango.com/common/og-image.jpg' },
        // Theme
        { name: 'theme-color', content: '#FF8E00' },
        { name: 'msapplication-TileColor', content: '#FF8E00' }
      ],
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
        { rel: 'icon', type: 'image/png', href: '/common/logodog-min-1.png' },
        { rel: 'apple-touch-icon', href: '/common/logodog-min-1.png' },
        { rel: 'canonical', href: 'https://petcango.com' }
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
