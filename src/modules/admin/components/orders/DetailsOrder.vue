<template lang="">
    <div class="grid">
        <div class="col-12">
            <Card>
                <template #content>
                    <div class="grid px-5">
                        <div class="col-12 sm:col-12 md:col-12 lg:col-6">
                            <h3>Direccion</h3>
                            <h3 class="color-text">{{adrressOrder}}</h3>
                        </div>
                        <div class="col-12 sm:col-12 md:col-12 lg:col-6">
                            <h3>Resumen</h3>
                            <div class="flex justify-content-between flex-wrap">
                                <h3 class="color-text m-0 mb-5">Subtotal</h3>
                                <h3 class="color-text m-0 mb-5">${{totalOrder.toFixed(2)}}</h3>
                            </div>
                            <div class="flex justify-content-between flex-wrap">
                                <h3 class="color-text m-0 mb-5">Total</h3>
                                <h3 class="color-text m-0 mb-5">${{totalOrder.toFixed(2)}}</h3>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
<script>
import Card from "primevue/card";
export default {
    components:{
        Card,
    },
    props: {
        address: {
            type: String,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
    },
    data() {
        return {
            totalOrder: 0.0,
            adrressOrder: "No hay dirección",
        }
    },
    methods: {
        updateCurrentProps() {
            this.totalOrder = this.total !== undefined ? this.total : 0.0;
            this.adrressOrder = this.address !== undefined ? this.address : "La dirección no esta disponible"; 
        }
    },
    watch: {
        address: {
            immediate: true,
            handler() {
                this.updateCurrentProps();
            },
        },
        total: {
            immediate: true,
            handler() {
                this.updateCurrentProps();
            },
        },
    },
    mounted() {
        this.updateCurrentProps();
    },
}
</script>

<style scoped>
.color-text {
    color: #7D7D7D;
}
.p-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}
</style>