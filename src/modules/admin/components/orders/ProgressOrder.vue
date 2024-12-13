<template>
    <div class="grid">
        <ConfirmDialog></ConfirmDialog>
        <div class="col-12">
            <Card>
                <template #content>
                    <div class="steps-container">
                        <div v-for="(step, index) in steps" :key="index" class="step"
                            :class="{ 'active': index <= currentStep, 'completed': index < currentStep, 'payment-issue': index === 0 && isPaymentIssue }">
                            <div class="circle">
                                <i v-if="index < currentStep" class="pi pi-check-circle"></i>
                                <i v-else-if="index === currentStep && !isPaymentIssue" class="pi pi-spin pi-spinner"></i>
                                <i v-else-if="index === 0 && isPaymentIssue" class="pi pi-times-circle"></i>
                                <i v-else class="pi pi-info-circle"></i>
                            </div>
                            <p class="label">{{ index === 0 && isPaymentIssue ? "Falta de pago" : step }}</p>
                            <div v-if="index < steps.length - 1" class="line"
                                :class="{ 'completed': index < currentStep }"></div>
                        </div>
                    </div>
                    <div class="flex justify-content-end flex-wrap px-5 pt-4">
                        <Button v-if="labelStep != null" :label="labelStep" :disabled="isPaymentIssue" @click="nextStep" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import Card from "primevue/card";
import Button from "primevue/button";
import AdminServices from "../../services/AdminServices";
import ConfirmDialog from 'primevue/confirmdialog';

export default {
    components: {
        Card,
        Button,
        ConfirmDialog
    },
    props: {
        status: {
            type: String,
            required: true
        },
        numOrder: {
            type: String,
            required: true
        },
    },
    data() {
        return {
            numOrderDetails: '',
            steps: ["Aceptado", "Preparando", "Enviado", "Entregado"],
            arrayLabel: ["Aceptar", "Preparar", "Enviar", "Finalizar"],
            stateOptions: {
                "accepted": 1,
                "in_progress": 2,
                "sent": 3,
                "delivered": 4,
                "pending_payment": true,
            },
            labelStep: "Aceptar",
            currentStep: 0,
            isPaymentIssue: false,
        };
    },
    methods: {
        async changeStatus(numOrder) {
            try {
                const response = await AdminServices.updateStatusOrder(numOrder);
                const { statusCode } = response;
                if (statusCode === 200) {
                    if (!this.isPaymentIssue && this.currentStep <= this.steps.length - 1) {
                        this.currentStep++;
                        this.labelStepF(this.currentStep);
                        if (this.steps[this.currentStep - 1] === "Enviado") {
                            await this.sendEmailSent(numOrder);
                        }
                        if (this.steps[this.currentStep - 1] === "Entregado") {
                            await this.sendEmailDelivered(numOrder);
                        }
                    }
                }
            } catch (error) {
                this.$toast.error("Error al cambiar el estado del pedido");
            }
        },
        updateCurrentStep() {
            this.numOrderDetails = this.numOrder != undefined ? this.numOrder : null;
            if (this.status === "pending_payment" && this.stateOptions["pending_payment"] === true) {
                this.isPaymentIssue = true;
                this.currentStep = 0;
                this.labelStep = null;
            } else {
                this.isPaymentIssue = false;
                const stepValue = this.stateOptions[this.status];
                this.currentStep = stepValue !== undefined ? stepValue : 0;
                this.labelStepF(this.currentStep);
            }
        },
        labelStepF(position) {
            this.labelStep = this.arrayLabel[position];
        },
        nextStep() {
            this.$confirm.require({
                message: `¿Seguro que quieres cambiar el estado a "${this.steps[this.currentStep]}"?`,
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sí',
                accept: () => {
                    this.changeStatus(this.numOrderDetails);
                },
                reject: () => {
                }
            });
            
        },
        async sendEmailSent(numOrder) {
            try {
                const response = await AdminServices.sendEmailSent(numOrder);
                const { statusCode } = response;
                if (statusCode === 200) {
                    this.$toast.success("Correo enviado correctamente");
                }
            } catch (error) {
                this.$toast.error("Error al enviar el correo");
            }
        },
        async sendEmailDelivered(numOrder) {
            try {
                const response = await AdminServices.sendEmailDelivered(numOrder);
                const { statusCode } = response;
                if (statusCode === 200) {
                    this.$toast.success("Correo enviado correctamente");
                }
            } catch (error) {
                this.$toast.error("Error al enviar el correo");
            }
        },
    },
    watch: {
        status: {
            immediate: true,
            handler() {
                this.updateCurrentStep();
            },
        },
        numOrder: {
            immediate: true,
            handler() {
                this.updateCurrentStep();
            },
        },
    },
};
</script>

<style scoped>
.p-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}
.steps-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
}

.step .circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dcdcdc;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    z-index: 1;
    transition: background-color 0.3s ease;
}

.step.active .circle {
    background-color: #76c7c0;
}

.step.completed .circle {
    background-color: #a2f07b;
}

.step.completed .circle i {
    color: #fff;
}

.step.payment-issue .circle {
    background-color: #ff7474;
}

.step.payment-issue .circle i {
    color: #fff;
}

.step .label {
    margin-top: 10px;
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: #757575;
    text-align: center;
}

.step.active .label,
.step.completed .label {
    color: #000;
}

.step.payment-issue .label {
    color: #ff7474;
}

.step .line {
    position: absolute;
    top: 25px;
    left: calc(50% + 25px);
    width: calc(100% - 50px);
    height: 4px;
    background-color: #e0e0e0;
    z-index: 0;
    transition: width 0.5s ease, background-color 0.3s ease;
}

.step .line.completed {
    background-color: #a2f07b;
    width: 100%;
}

.step .line.completed+.step .line {
    background-color: #a2f07b;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>
