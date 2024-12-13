import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    base: "/pwa-cm/",
    plugins: [
      vue(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: "Crochet Mart",
          short_name: "Crochet Mart",
          description: "Aplicación de Ventas de Productos de Crochet",
          icons: [
            {
              src: "https://i.ibb.co/ts0TfHr/144.png",
              sizes: "144x144",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "https://i.ibb.co/CtqyvwS/192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "https://i.ibb.co/kcshw2q/512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
          ],
          start_url: "/pwa-cm/admin225ij5a2o1uzptgeo9g",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#000000",
          orientation: "portrait",
          scope: "/",
          lang: "es-MX",
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,woff2}"],
          globDirectory: isDevelopment ? "dev-dist" : "dist",
          globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
        },
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^primevue\/((?!config|resources).*)*$/,
          replacement: 'primevue/$1/$1.umd.js',
        },
        {
          find: /^@\/(.*)/,
          replacement: resolve(__dirname, "src/$1"),
        },
      ]
    },
    server: {
      port: 4200,
    },
    build: {
      outDir: "dist",
    },
  };
});
