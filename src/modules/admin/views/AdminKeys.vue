<template>
    <div class="px-5 root-element">
        <div class="grid">
            <h4>Administrar Stripe Keys</h4>
        </div>
        <div class="grid">
            <div class="col-12 lg:col-6 xl:col-4">
                <Card>
                    <template #content>
                        <div class="grid px-5">
                            <div
                                class="col-12 sm:col-6 md:col-6 lg:col-6 xl:col-6 flex flex-column justify-content-between flex-wrap">
                                <h3>Key Stripe</h3>
                                <h5>{{ stripeKey || 'Aún no se ha configurado la clave.' }}</h5>
                            </div>
                            <div
                                class="col-12 sm:col-6 md:col-6 lg:col-6 xl:col-6 flex flex-column justify-content-between flex-wrap">
                                <div class="flex justify-content-end flex-wrap">
                                    <i class="pi pi-key" style="font-size: 2rem"></i>
                                </div>
                                <div class="flex justify-content-end flex-wrap">
                                    <Button icon="pi pi-pencil" class="p-button-card p-button-raised p-button-outlined"
                                        @click="openStripeModal" />
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <Dialog class="font-bold" header="Actualizar Stripe Key" :visible.sync="stripeModalVisible"
            :containerStyle="{ width: '30vw' }" modal closable>
            <div class="p-fluid">
                <div class="field">
                    <label for="publicKey">Clave Pública</label>
                    <InputText id="publicKey" v-model="newKeyPublic" :class="{ 'p-invalid': isPublicKeyInvalid }"
                        @blur="validateKeys" />
                    <small v-if="isPublicKeyInvalid" class="p-error">La clave pública es obligatoria.</small>
                </div>
                <div class="field">
                    <label for="privateKey">Clave Privada</label>
                    <InputText id="privateKey" v-model="newKeyPrivate" :class="{ 'p-invalid': isPrivateKeyInvalid }"
                        @blur="validateKeys" />
                    <small v-if="isPrivateKeyInvalid" class="p-error">La clave privada es obligatoria.</small>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" class="p-button-text p-button-secondary" @click="closeStripeModal" />
                <Button label="Guardar" class="p-button" @click="submitStripeKey" :disabled="!isFormValid" />
            </template>

        </Dialog>

        <div class="grid">
            <h4>Administrar Links App Móvil</h4>
        </div>
        <div class="grid">
            <CardsLinks @updateSubtitle="updateAndroidLink" title="Link Play Store"
                :subtitle="androidLink || 'Aún no se ha configurado el link para la Play Store.'" platform="android" />
            <CardsLinks @updateSubtitle="updateIosLink" title="Link App Store"
                :subtitle="iosLink || 'Aún no se ha configurado el link para la App Store.'" platform="ios" />
        </div>
    </div>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import CardsLinks from '../components/keys/CardsLinks.vue';
import AdminServices from '../../admin/services/AdminServices';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Utils from "@/core/utils/FunctionGlobals";

export default {
    components: {
        Card,
        Button,
        CardsLinks,
        Dialog,
        InputText
    },
    data() {
        return {
            iosLink: null,
            androidLink: null,
            stripeKey: null,
            newKeyPublic: '',
            newKeyPrivate: '',
            stripeModalVisible: false,
            isPublicKeyInvalid: false,
            isPrivateKeyInvalid: false,

        };
    },
    computed: {
        isFormValid() {
            return this.newKeyPublic.trim() && this.newKeyPrivate.trim();
        },
    },
    methods: {
        updateAndroidLink(newLink) {
            this.androidLink = newLink;
        },
        updateIosLink(newLink) {
            this.iosLink = newLink;
        },
        openStripeModal() {
            this.stripeModalVisible = true;
        },
        closeStripeModal() {
            this.stripeModalVisible = false;
            this.newKeyPublic = '';
            this.newKeyPrivate = '';
            this.isPublicKeyInvalid = false;
            this.isPrivateKeyInvalid = false;
        },
        validateKeys() {
            this.isPublicKeyInvalid = !this.newKeyPublic.trim();
            this.isPrivateKeyInvalid = !this.newKeyPrivate.trim();
        },
        async submitStripeKey() {
            this.validateKeys();
            if (!this.isFormValid) return;

            try {
                const payload = {
                    keyPublic: this.newKeyPublic,
                    keyPrivate: this.newKeyPrivate,
                }
                const response = await AdminServices.updateKeysStripe(payload);
                if (response.statusCode === 201) {
                    this.getStripe()
                    this.$toast.success('Clave de Stripe actualizada correctamente.');
                } else {
                    this.$toast.error(response.message || 'Error al actualizar la clave de Stripe.');
                }
            } catch (error) {
                this.$toast.error('No se pudo actualizar la clave de Stripe.');
            } finally {
                this.closeStripeModal();
            }
        },
        async getLinks() {
            try {
                const iosResponse = await AdminServices.getLinkIos();
                this.iosLink = iosResponse?.data?.url || null;

                const androidResponse = await AdminServices.getLinkAndroid();
                this.androidLink = androidResponse?.data?.url || null;
            } catch (error) {
                this.$toast.error('No se pudo obtener el link.');
            }
        },
        async getStripe() {
            const stripeResponse = await AdminServices.getLinkStripe();
            this.stripeKey = stripeResponse?.data?.updateAt
                ? Utils.formatDate(stripeResponse.data.updateAt)
                : null;
        }
    },
    mounted() {
        this.getLinks();
        this.getStripe();
    },
};
</script>

<style scoped>
.p-button-card {
    border-radius: 100px !important;
    background-color: #ffff !important;
    border-color: #252525 !important;
    color: #252525 !important;
    height: 50px !important;
    width: 50px !important;
}

p {
    margin: 0;
    text-align: center;
    color: #888;
}

.p-card {
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #f0f0f0;
}
</style>