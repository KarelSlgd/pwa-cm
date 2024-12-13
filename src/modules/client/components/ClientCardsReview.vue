<template>
  <div class="review-card surface-card shadow-1 p-4">
    <div class="flex align-items-center mb-1">
      <Rating
        v-model="localData.rating"
        :stars="5"
        :readonly="true"
        :cancel="false"
      />
    </div>

    <div class="flex align-items-center mb-2">
      <h3 class="text-xl font-bold mr-2">Anonimo</h3>
      <i class="pi pi-check-circle text-green-500"></i>
    </div>

    <p class="text-secondary m-0">
      {{ localData.comment }}
    </p>
  </div>
</template>

<script>
import Rating from "primevue/rating";
export default {
  components: {
    Rating,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localData: { ...this.data },
    };
  },
  computed: {
    formattedDate() {
      const date = new Date(this.localData.createdAt);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.review-card {
  margin: 1rem auto;
  border: 1px solid #e0e0e0;
  border-radius: 1rem;
}
.text-green-500 {
  color: #10b981;
}

.text-secondary {
  color: #666;
}
</style>
