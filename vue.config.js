const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 4200,
  },
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://www.energiasustentable.study/8080/api/'),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'dynamic-api-cache',
            expiration: {
              maxEntries: 100, // Máximo de entradas en caché
              maxAgeSeconds: 7 * 24 * 60 * 60, // 1 semana
            },
            cacheableResponse: {
              statuses: [0, 200], // Respuestas válidas para la caché
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
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
});
