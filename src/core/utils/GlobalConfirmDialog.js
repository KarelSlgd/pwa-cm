import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';

const ConfirmDialogPlugin = {
    install(VueInstance) {
        VueInstance.use(ConfirmationService);
        VueInstance.component('ConfirmDialog', ConfirmDialog);

        VueInstance.prototype.$confirm = {
            /**
             * @param {Object} options 
             * @param {string} options.message 
             * @param {string} [options.header='Confirmación'] 
             * @param {string} [options.icon='pi pi-question'] 
             * @param {Function} options.accept - Funcion a ejecutar si el usuario confirma.
             * @param {Function} [options.reject] - Funcion a ejecutar si el usuario cancela.
             */
            show({ message, header = 'Confirmación', icon = 'pi pi-question', accept, reject }) {
                if (!VueInstance.prototype.$primevue?.confirmation) {
                    console.error('No esta configurado');
                    return;
                }

                VueInstance.prototype.$primevue.confirmation.confirm({
                    message,
                    header,
                    icon,
                    accept,
                    reject,
                });
            },
        };
    },
};

export default ConfirmDialogPlugin;
