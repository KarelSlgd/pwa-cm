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
          urlPattern: new RegExp('^http://52\\.206\\.58\\.127:8080/api/'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-category-cache',
            networkTimeoutSeconds: 50, // Tiempo de espera para la red
            expiration: {
              maxEntries: 50, // Máximo de entradas en caché
              maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semana
            },
            cacheableResponse: {
              statuses: [0, 500], // Respuestas cacheables
            },
          },
        },
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