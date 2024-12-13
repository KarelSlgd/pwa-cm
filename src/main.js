import Vue from 'vue'
import App from './App.vue'
import router from './router/index';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import ToastPlugin from '@/core/utils/Alerts';

import "@/assets/styles/main.css";
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import store from './store/store';
Vue.config.productionTip = false;
Vue.use(PrimeVue);
Vue.use(store);
Vue.use(ToastService);
Vue.use(ConfirmationService);
Vue.use(ToastPlugin);
import { registerSW } from 'virtual:pwa-register'
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

// Registra el Service Worker con  virtual:pwa-register
registerSW({
  immediate: true,
  onOfflineReady() {
    if (navigator.serviceWorker) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
    // Muestra una notificación o realiza alguna acción cuando la PWA esté lista para funcionar offline.
    console.log('App is offline-ready');
  },
  onRegistered(r) {
    r && setInterval(() => { r.update(); }, 1800000); //Opcional, para verificar actualizaciones cada 30min
  }
});
