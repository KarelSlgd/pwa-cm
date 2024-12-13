const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 4200,
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp('^.*\\.(js|css|html|png|jpg|jpeg|svg|gif|ico|woff|woff2)$'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-assets-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
})