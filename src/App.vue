<template>
  <div class="main">
    <router-view />
  </div>
</template>

<script>
import { sendPendingRequests as sendPublicPendingRequests } from '../src/core/api/HttpPublic';
import { sendPendingRequests as sendPrivatePendingRequests } from '../src/core/api/HttpPrivate';

export default {
  data() {
    return {};
  },
  methods: {
    async notifyUser(title, message) {
      if ("Notification" in window && "serviceWorker" in navigator) {
        if (Notification.permission === "granted") {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, {
            body: message,
            icon: "src/assets/images/logo.png",
            badge: "src/assets/images/grillo.png",
          });
        } else {
          console.warn("No se pueden mostrar notificaciones nativas: permisos no otorgados.");
        }
      } else {
        console.warn("El navegador no soporta notificaciones o service workers.");
      }
    },

    async handleOnline() {
      // Procesar peticiones pendientes
      await sendPrivatePendingRequests();
      await sendPublicPendingRequests();

      // Enviar notificación nativa si se tienen permisos
      if (Notification.permission === "granted") {
        this.notifyUser(
          "Conexión Restaurada",
          "Las peticiones pendientes se han procesado con éxito."
        );
      } else {
        // Mostrar toast si no hay permisos para notificaciones nativas
        this.$toast.success("Conexión restaurada. Procesando peticiones pendientes...");
      }
    },

    handleOffline() {
      // Mostrar notificación nativa cuando no hay conexión
      this.notifyUser(
        "Conexión Perdida",
        "No tienes conexión a internet. Las peticiones se enviarán al restablecer la conexión."
      );
    },
  },
  mounted() {
    // Añadir listeners para los eventos 'online' y 'offline'
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);

    // Verificar estado inicial
    if (navigator.onLine) {
      this.handleOnline();
    } else {
      this.handleOffline();
    }
  },
  beforeDestroy() {
    // Eliminar listeners cuando el componente se destruya
    window.removeEventListener("online", this.handleOnline);
    window.removeEventListener("offline", this.handleOffline);
  },
};
</script>

<style scoped>
.main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  font-family: "Poppins", sans-serif;
}
</style>
