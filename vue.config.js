const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 4200, // Puerto de desarrollo
  },
  pwa: {
    workboxPluginMode: 'GenerateSW', // Generar Service Worker automáticamente
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://www.energiasustentable.study:8443/api/'), // API dinámica
          handler: 'StaleWhileRevalidate', // Caché dinámico
          options: {
            cacheName: 'api-dynamic-cache',
            expiration: {
              maxEntries: 50, // Máximo de entradas en caché
              maxAgeSeconds: 7 * 24 * 60 * 60, // Tiempo de vida de 7 días
            },
            cacheableResponse: {
              statuses: [0, 200], // Cachear solo respuestas exitosas
            },
          },
        },
        {
          urlPattern: new RegExp('^.*\\.(js|css|html|png|jpg|jpeg|svg|gif|ico|woff|woff2)$'), // Archivos estáticos
          handler: 'CacheFirst', // Archivos estáticos primero desde el caché
          options: {
            cacheName: 'static-assets-cache',
            expiration: {
              maxEntries: 100, // Máximo de entradas en caché
              maxAgeSeconds: 30 * 24 * 60 * 60, // Tiempo de vida de 30 días
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