<template>
  <div class="grid grid-nogutter px-4 sm:px-6 lg:px-6">
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Estado del pedido</p>
    </div>
    <div class="col-12">
      <ProgressOrder
        v-if="details?.status && details?.numOrder"
        :status="details?.status"
        :numOrder="details?.numOrder"
      />
    </div>
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Detalles del pedido</p>
    </div>
    <div class="col-12">
      <DetailsOrder
        v-if="details?.total && details?.address"
        :total="details?.total"
        :address="details?.address"
      />
    </div>
    <div class="col-12 md:col-6 flex align-items-center py-2">
      <p class="text-lg font-bold">Productos del pedido</p>
    </div>
    <div class="col-12">
      <ProductsOrder v-if="details?.products" :products="details?.products" />
    </div>
  </div>
</template>

<script>
import AdminServices from "../services/AdminServices";
import ProgressOrder from "../components/orders/ProgressOrder.vue";
import DetailsOrder from "../components/orders/DetailsOrder.vue";
import ProductsOrder from "../components/orders/ProductsOrder.vue";

export default {
  components: {
    ProgressOrder,
    DetailsOrder,
    ProductsOrder,
  },
  data() {
    return {
      details: {},
      order: null,
    };
  },
  methods: {
    async getDetailOrder(numOrder) {
      try {
        const response = await AdminServices.getOrderByNumOrder(numOrder);
        const { data, statusCode } = response;
        if (statusCode === 200) {
          this.details = data;
        }
      } catch (error) {
        this.$toast.error("Error al obtener los detalles del pedido");
      }
    },
  },
  mounted() {
    const storedProduct = sessionStorage.getItem("selectedOrder");
    if (storedProduct) {
      this.order = JSON.parse(storedProduct);
      if (this.order) {
        this.$root.$emit("updateNavbarSubtitle", this.order.numOrder);
        this.getDetailOrder(this.order.numOrder);
      }
    }
  },
};
</script>

<style scoped>
.p-button {
  border-radius: 100px !important;
}
</style>