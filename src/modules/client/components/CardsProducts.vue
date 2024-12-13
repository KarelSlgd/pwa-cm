<template>
  <div
    class="product-card surface-card p-3 shadow-2 border-round-xl mx-2"
    @click="$emit('click')"
  >
    <img
      :src="product.image || notFound"
      alt="Producto"
      class="product-image w-full border-round mb-3"
    />
    <div class="flex flex-column align-items-start">
      <h3 class="mt-0 mb-2">{{ product.productName }}</h3>
      <div class="flex align-items-center w-full">
        <span class="text-xl font-bold flex-grow-1">{{ formattedPrice }}</span>
        <div class="flex align-items-center gap-1">
          <Rating :stars="1" :readonly="true" :cancel="false" :value="1" />
          <p>{{ formattedRating }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import notFound from "@/assets/images/noImageFound.png";
import Rating from "primevue/rating";

export default {
  name: "ProductCard",
  components: {
    Rating,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedPrice() {
      return `$${parseFloat(this.product.price).toFixed(2)}`;
    },
    formattedRating() {
      return parseFloat(this.product.avgRating).toFixed(1);
    },
  },
  data() {
    return {
      notFound,
    };
  },
};
</script>

<style scoped>
.product-card {
  width: 100%;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 50px;
}
</style>
