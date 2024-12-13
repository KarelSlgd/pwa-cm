<template>
    <div class="col-12 lg:col-6 xl:col-4">
        <Card>
            <template #content>
                <div class="grid px-5">
                    <div
                        class="col-12 sm:col-6 md:col-6 lg:col-6 xl:col-6 flex flex-column justify-content-between flex-wrap">
                        <h3>{{ title }}</h3>
                        <h5>{{ subtitle }}</h5>
                    </div>
                    <div
                        class="col-12 sm:col-6 md:col-6 lg:col-6 xl:col-6 flex flex-column justify-content-between flex-wrap">
                        <div class="flex justify-content-end flex-wrap">
                            <i :class="iconClass" style="font-size: 2rem"></i>
                        </div>
                        <div class="flex justify-content-end flex-wrap">
                            <Button icon="pi pi-pencil" class="p-button-card p-button-raised p-button-outlined"
                                @click="openModal" />
                        </div>
                    </div>
                </div>
            </template>
        </Card>

        <Dialog header="Actualizar Link" class="font-bold" :visible.sync="localVisible"
            :containerStyle="{ width: '30vw' }" modal closable @hide="closeModal">
            <div class="p-fluid">
                <div class="field">
                    <label for="linkUrl">Link</label>
                    <InputText id="linkUrl" v-model="linkUrl" :placeholder="placeholderText"
                        :class="{ 'p-invalid': isLinkUrlInvalid }" @blur="validateLinkUrl" />
                    <small v-if="isLinkUrlInvalid" class="p-error">
                        {{ errorMessage }}
                    </small>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" class="p-button-text p-button-secondary" @click="closeModal" />
                <Button label="Guardar" class="p-button" @click="submitForm" :disabled="!linkUrl || isLinkUrlInvalid" />
            </template>
        </Dialog>
    </div>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import AdminServices from '../../services/AdminServices';
export default {
    components: {
        Card,
        Button,
        Dialog,
        InputText,
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            localVisible: false,
            linkUrl: '',
            isLinkUrlInvalid: false,
        };
    },
    computed: {
        iconClass() {
            return this.platform === 'ios' ? 'pi pi-apple' : 'pi pi-android';
        },
        placeholderText() {
            return this.platform === 'ios'
                ? 'Ingrese el link de la App Store'
                : 'Ingrese el link de la Play Store';
        },
        errorMessage() {
            return this.platform === 'ios'
                ? 'El link de la App Store es obligatorio y debe ser válido.'
                : 'El link de la Play Store es obligatorio y debe ser válido.';
        },
    },
    methods: {
        openModal() {
            this.localVisible = true;
        },
        closeModal() {
            this.localVisible = false;
            this.resetForm();
        },
        resetForm() {
            this.linkUrl = '';
            this.isLinkNameInvalid = false;
            this.isLinkUrlInvalid = false;
        },

        validateLinkUrl() {
            const urlRegex = /^(https?:\/\/)?([\w\d-]+\.){1,}[\w\d-]+(\/[\w\d#?&%=+.-]*)*$/;
            this.isLinkUrlInvalid = !this.linkUrl || !urlRegex.test(this.linkUrl);
        },
        async submitForm() {
            this.validateLinkUrl();
            if (this.isLinkUrlInvalid) {
                return;
            }
            try {
                if (this.platform === 'android') {
                    await this.submitAndroidLink();
                } else if (this.platform === 'ios') {
                    await this.submitIosLink();
                }
            } catch (error) {
                this.$toast.error("Algo sucedio al enviar el link");
            }
            this.closeModal();
        },
        async submitAndroidLink() {
            try {
                const { statusCode, message } = await AdminServices.updateAppAndroid({ url: this.linkUrl })
                if (statusCode === 200) {
                    this.$emit('updateSubtitle', this.linkUrl);
                    this.$toast.success(message);
                } else {
                    this.$toast.error(message);
                }
            } catch (error) {
                this.$toast.error("Algo sucedio al enviar el link");
            }
        },

        async submitIosLink() {
            try {
                const { statusCode, message } = await AdminServices.updateAppIos({ url: this.linkUrl })

                if (statusCode === 200) {
                    this.$emit('updateSubtitle', this.linkUrl);
                    this.$toast.success(message);
                } else {
                    this.$toast.error(message);
                }
            } catch (error) {
                this.$toast.error("Algo sucedio al enviar el link");
            }
        },
    },
};
</script>

<style scoped>
.p-error {
    color: red;
}

.p-button-card {
    border-radius: 100px !important;
    background-color: #ffff !important;
    border-color: #252525 !important;
    color: #252525 !important;
    height: 50px !important;
    width: 50px !important;
}
.p-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}
</style>