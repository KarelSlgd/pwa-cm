import Vue from 'vue';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const ToastPlugin = {
    install(VueInstance) {
        const ToastConstructor = Vue.extend(Toast);
        const toastInstance = new ToastConstructor();
        toastInstance.$mount(document.createElement('div'));
        document.body.appendChild(toastInstance.$el);

        VueInstance.prototype.$toast = {
            /**
             * @param {Object} options 
             * @param {string} options.severity 
             * @param {string} options.summary 
             * @param {string} options.detail 
             * @param {number} options.life 
             */
            show({ severity, summary, detail, life = 3000 }) {
                toastInstance.add({ severity, summary, detail, life });
            },

            success(detail, life = 3000) {
                this.show({ severity: 'success', summary: 'Operacion exitosa', detail, life });
            },
            error(detail, life = 3000) {
                this.show({ severity: 'error', summary: 'Operacion fallida', detail, life });
            },
            info(detail, life = 3000) {
                this.show({ severity: 'info', summary: 'Informacion', detail, life });
            },
            warn(detail, life = 3000) {
                this.show({ severity: 'warn', summary: 'Advertencia', detail, life });
            },
        };
    },
};

Vue.use(ToastService);
Vue.use(ToastPlugin);

export default ToastPlugin;


