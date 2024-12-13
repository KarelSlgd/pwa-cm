<template lang="">
    <div class="grid">
        <div class="col-12">
            <Card>
                <template #content>
                    <div v-for="(product, index) in productsOrder" :key="index">
                        <div class="grid px-5">
                            <div class="col-12 md:col-6 lg:col-4 xl:col-3 flex justify-content-center flex-wrap">
                                <img :src="product?.image" alt="product" class="sized"/>
                            </div>
                            <div class="col-12 md:col-6 lg:col-5 xl:col-5">
                                <p class="text-black">{{product?.name}}</p>
                                <p class="text-gray">Color:  {{product?.color}}</p>
                                <p class="text-gray">Cantidad:  {{product?.quantity}}</p>
                            </div>
                            <div class="col-12 lg:col-3 xl:col-4 flex justify-content-end flex-wrap">
                                <p class="text-black">Total: ${{product?.total.toFixed(2)}}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>     
    </div>
</template>
<script>
import Card from 'primevue/card'
export default {
    components: {
        Card,
    },
    props: {
        products: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            productsOrder: [],
        }
    },
    methods: {
        updateCurrentProps() {
            this.productsOrder = this.products !== undefined ? this.products : [];
        }
    },
    watch: {
        products: {
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
.p-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
}
p {
    font-size: 18px;
    font-weight: bold;
}
.text-black {
    color: #252525;
}
.text-gray {
    color: #7D7D7D;
}
.sized {
    width: 150px;
    height: 150px;
}
</style>