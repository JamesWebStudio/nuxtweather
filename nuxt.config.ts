export default defineNuxtConfig({
  ssr: false,
    css: ['~/assets/css/main.css'],
    app: {
      head: {
        meta: [{"name": "viewport", "content": "width=device-width, initial-scale=1"}, {"charset": "utf-8"}],
        link: [
          { rel: 'apple-touch-icon', sizes:"180x180", href: './public/apple-touch-icon.png' },
          { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'favicon-32x32.png' },
          { rel: 'icon', type: 'image/png', sizes:'16x16', href: 'favicon-16x16.png' },
          { rel: 'manifest', href: 'manifest.json' }
        ],
      }
    },
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
    modules: [
      // '@nuxtjs/pwa'
    ]
    
      
      
      
})

